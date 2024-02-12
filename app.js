require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  // logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

//   model schema
const post = sequelize.define("post", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  village: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

app.get("/", (req, res) => {
  res.send("Hello Captain!");
});

app.post("/create-post", async (req, res) => {
  const { name, phone, region, village } = req.body;
  try {
    const newPost = await post.create({ name, phone, region, village });
    res.json(newPost);
  } catch (err) {
    console.log(err);
  }
});

app.get("/get-posts", async (req, res) => {
  try {
    const allPosts = await post.findAll();
    res.json(allPosts);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete-all-posts", async (req, res) => {
  try {
    await post.destroy({ where: {} });
    res.send("All posts deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



