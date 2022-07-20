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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var jsonStorageModel_1 = require("./jsonStorageModel");
var mongodb_1 = require("mongodb");
var uri = 'mongodb://127.0.0.1:27017';
var client = new mongodb_1.MongoClient(uri);
var JsonService = /** @class */ (function () {
    function JsonService() {
    }
    JsonService.prototype.write = function (key, json) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonStorageColl, twinKey, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, (0, jsonStorageModel_1["default"])()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client.connect()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, client.db('jsonStorage').collection('jsonDataTable')];
                    case 3:
                        jsonStorageColl = _a.sent();
                        return [4 /*yield*/, jsonStorageColl.findOne({ _id: key })];
                    case 4:
                        twinKey = _a.sent();
                        if (twinKey)
                            return [2 /*return*/, { status: 409, message: 'Link with such parameter already exists' }];
                        console.log(JSON.stringify(json));
                        // @ts-ignore
                        return [4 /*yield*/, jsonStorageColl.insertOne({ _id: key, json: JSON.stringify(json) })];
                    case 5:
                        // @ts-ignore
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, { status: 500, message: 'Something bad happened' }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    JsonService.prototype.read = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonStorageColl, dataExtraction, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, client.db('jsonStorage').collection('jsonDataTable')];
                    case 1:
                        jsonStorageColl = _a.sent();
                        return [4 /*yield*/, jsonStorageColl.findOne({ _id: key })];
                    case 2:
                        dataExtraction = _a.sent();
                        if (!dataExtraction)
                            return [2 /*return*/, { status: 404, message: 'No data with such url parameter' }];
                        return [2 /*return*/, dataExtraction];
                    case 3:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, { status: 500, message: 'Something bad happened' }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return JsonService;
}());
exports["default"] = new JsonService();
