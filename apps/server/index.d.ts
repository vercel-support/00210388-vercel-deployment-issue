import {
    StrictAuthProp,
} from '@clerk/clerk-sdk-node';
import { Express as ExpressI } from 'express';


declare global {
    namespace Express {
      interface Request extends StrictAuthProp {}
      interface Router extends ExpressI.Router {}
    }
}
     