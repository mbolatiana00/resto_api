import express, { request, response } from "express";
import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.route";
import driverRoutes from "./routes/driver.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import deliveryRoutes from "./routes/delivery.routes";
import trackingRoutes from "./routes/tracking.routes";
import paymentRoutes from "./routes/payment.routes"
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
app.use("/resto_api/drivers", driverRoutes);
app.use("/resto_api/vehicles", vehicleRoutes);
app.use("/resto_api/deliveries", deliveryRoutes);
app.use("/resto_api/tracking", trackingRoutes);
app.use("/resto_api/payments", paymentRoutes);
//// Route de test 
app.get("/", (request, response)=>{
    response.json(
        {
            message : "api lancer 🚀",
            version : "1.0.0",
            endpoint : {
               users: "/resto_api/users",
      orders: "/resto_api/orders",
      drivers: "/resto_api/drivers",
      vehicles: "/resto_api/vehicles",
      deliveries: "/resto_api/deliveries",
      tracking: "/resto_api/tracking",
      payments: "/resto_api/payments",
            }
        }
    )
})
/** 
const ws = new WebSocket("http://localhost:5000");
ws.onmessage = (e) => { const { status, driverLocation, estimatedArrival } = JSON.parse(e.data); console.log('Status:', status); console.log('Location:', driverLocation); };
*/
export default app;
