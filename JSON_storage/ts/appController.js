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
var service_1 = require("./service");
var appController = /** @class */ (function () {
    function appController() {
    }
    appController.prototype.saveJson = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var json, json_name, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Object.keys(req.params).length > 1)
                            return [2 /*return*/, res.status(414).json({ message: 'Not valid url, too many params in the URL.' })];
                        json = req.body;
                        json_name = req.params.json_name;
                        if (Object.keys(json).length < 1)
                            return [2 /*return*/, res.status(400).json({ message: 'JSON is missing' })];
                        return [4 /*yield*/, service_1["default"].write(json_name, json)];
                    case 1:
                        data = _a.sent();
                        if (data) // mb it should be as if(typeof data === 'object')
                            return [2 /*return*/, res.status(data.status).json({ message: data.message })];
                        return [2 /*return*/, res.json({ message: 'Your json data has been saved' })];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, res.status(500).json({ message: 'Error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    appController.prototype.sendJson = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var json_name, modelData, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        json_name = req.params.json_name;
                        return [4 /*yield*/, service_1["default"].read(json_name)];
                    case 1:
                        modelData = _a.sent();
                        if (modelData.status)
                            return [2 /*return*/, res.status(modelData.status).json({ message: modelData.message })];
                        return [2 /*return*/, res.json(JSON.parse(modelData['json']))];
                    case 2:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, res.status(500).json({ message: 'Error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    appController.prototype.postHelper = function (res) {
        return res.json({ message: 'Please enter valid url parameter' });
    };
    appController.prototype.getHelper = function (res) {
        return res.json({ message: 'Please enter valid json and url parameter' });
    };
    return appController;
}());
exports["default"] = new appController();
