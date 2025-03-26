import mongoose from "mongoose";



async function connectDataBase() {
    await mongoose
        .connect(
            "mongodb+srv://.6dajq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        )
}

export default connectDataBase
