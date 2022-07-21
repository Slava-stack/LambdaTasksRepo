"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonStorageModel_1 = __importDefault(require("./jsonStorageModel"));
const mongodb_1 = require("mongodb");
const uri = 'mongodb://127.0.0.1:27017';
const client = new mongodb_1.MongoClient(uri);
class JsonService {
    write(key, json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, jsonStorageModel_1.default)();
                yield client.connect();
                const jsonStorageColl = yield client.db('jsonStorage').collection('jsonDataTable');
                const twinKey = yield jsonStorageColl.findOne({ _id: key });
                if (twinKey)
                    return { status: 409, message: 'Link with such parameter already exists' };
                // @ts-ignore            // _id problem
                yield jsonStorageColl.insertOne({ _id: key, json: JSON.stringify(json) });
            }
            catch (e) {
                console.log(e);
                return { status: 500, message: 'Something bad happened' };
            }
        });
    }
    read(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsonStorageColl = yield client.db('jsonStorage').collection('jsonDataTable');
                const dataExtraction = yield jsonStorageColl.findOne({ _id: key });
                if (!dataExtraction)
                    return { status: 404, message: 'No data with such url parameter' };
                return dataExtraction;
            }
            catch (e) {
                console.log(e);
                return { status: 500, message: 'Something bad happened' };
            }
        });
    }
}
exports.default = new JsonService();
