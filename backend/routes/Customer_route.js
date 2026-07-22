import express from 'express';
import { verifyToken } from '../middleware/auth_middleware.js';
import {getProfile,updateProfile} from '../controller/customerController.js'

const route = express.Router();

route.get('/profile',verifyToken,getProfile);
route.put('/profile',verifyToken,updateProfile);

export default route;

