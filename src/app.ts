import express, { request, response } from "express";
import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.route"

const app = express();
// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
interface Request{
    request : Request
}

app.use("/resto_api/users", userRoutes);
app.use("/resto_api/orders", orderRoutes);

//// Route de test 
app.get("/", (request, response)=>{
    response.json(
        {
            message : "api lancer 🚀",
            version : "1.0.0",
            endpoint : {
                users : "/resto_api/users/",
                orders : "/resto_api/orders/"
            }
        }
    )
})

export default app;
