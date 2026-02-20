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
               users: "/api/users",
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

// Route 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Gestion des erreurs globale
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
