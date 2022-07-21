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
const service_1 = __importDefault(require("./service"));
class appController {
    saveJson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (Object.keys(req.params).length > 1)
                    return res.status(414).json({ message: 'Not valid url, too many params in the URL.' });
                const json = req.body;
                const { json_name } = req.params;
                if (Object.keys(json).length < 1)
                    return res.status(400).json({ message: 'JSON is missing' });
                const data = yield service_1.default.write(json_name, json);
                if (data)
                    return res.status(data.status).json({ message: data.message });
                return res.json({ message: 'Your json data has been saved' });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: 'Error' });
            }
        });
    }
    sendJson(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { json_name } = req.params;
                let modelData = yield service_1.default.read(json_name);
                if (modelData.status)
                    return res.status(modelData.status).json({ message: modelData.message });
                // @ts-ignore        modelData.json problem
                return res.json(JSON.parse(modelData.json));
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: 'Error' });
            }
        });
    }
    postHelper(res) {
        return res.json({ message: 'Please enter valid url parameter' });
    }
    getHelper(res) {
        return res.json({ message: 'Please enter valid json and url parameter' });
    }
}
exports.default = new appController();
