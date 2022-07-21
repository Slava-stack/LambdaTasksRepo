import JsonService from './service';
import {Request, Response} from 'express';

type objectResponse = Response<{ message: string }>;
type saveJsonRequest = Request<{ json_name: string }, { json: string }>;

class appController {
    public async saveJson(req: saveJsonRequest, res: Response): Promise<objectResponse> {
        try {
            if (Object.keys(req.params).length > 1)
                return res.status(414).json({message: 'Not valid url, too many params in the URL.'});
            const json: object = req.body;
            const {json_name}: { json_name: string } = req.params;
            if (Object.keys(json).length < 1)
                return res.status(400).json({message: 'JSON is missing'});
            const data = await JsonService.write(json_name, json);
            if (data)
                return res.status(data.status).json({message: data.message});
            return res.json({message: 'Your json data has been saved'});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Error'});
        }
    }

    public async sendJson(req: Request<{ json_name: string }>, res: Response): Promise<objectResponse | Response<object>> {
        try {
            const {json_name}: { json_name: string } = req.params;
            let modelData = await JsonService.read(json_name);
            if (modelData.status)
                return res.status(modelData.status).json({message: modelData.message});
            // @ts-ignore        modelData.json problem
            return res.json(JSON.parse(modelData.json));
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Error'});
        }
    }

    public postHelper(res: Response): objectResponse {
        return res.json({message: 'Please enter valid url parameter'});
    }

    public getHelper(res: Response): objectResponse {
        return res.json({message: 'Please enter valid json and url parameter'});
    }
}

export default new appController();