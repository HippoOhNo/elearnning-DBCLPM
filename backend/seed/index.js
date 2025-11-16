/* eslint-disable no-console */
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "config", ".env") });

const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Order = require("../model/order");
const CoupounCode = require("../model/coupounCode");
const Event = require("../model/event");
const Conversation = require("../model/conversation");
const Messages = require("../model/messages");
const Withdraw = require("../model/withdraw");

// Danh mục theo UI
const CATEGORIES = [
  "Computers and Laptops",
  "Cosmetics and Body Care",
  "Accessories",
  "Clothes",
  "Shoes",
  "Gifts",
  "Pet Care",
  "Mobile and Tablets",
  "Music and Gaming",
  "Others",
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// ảnh mẫu (đường dẫn tương đối trên server). Có thể thêm ảnh thật vào backend/uploads/seed/ để UI hiển thị đẹp.
const image = (seed, i = 1) => `/uploads/seed/${slug(seed)}-${i}.jpg`;

function makeAddress(idx) {
  return {
    country: "VN",
    city: ["Hanoi", "HCM", "Danang"][idx % 3],
    address1: `No. ${100 + idx} Nguyen Trai`,
    address2: `Ward ${1 + (idx % 9)}, District ${1 + (idx % 5)}`,
    zipCode: 100000 + idx,
    addressType: idx % 2 === 0 ? "Home" : "Office",
  };
}

async function connect() {
  const uri = process.env.DB_URL;
  if (!uri) throw new Error("Thiếu DB_URL trong config/.env");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
}

async function clearAll() {
  await Promise.all([
    User.deleteMany({}),
    Shop.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    CoupounCode.deleteMany({}),
    Event.deleteMany({}),
    Conversation.deleteMany({}),
    Messages.deleteMany({}),
    Withdraw.deleteMany({}),
  ]);
}

function buildUsers() {
  const users = [];
  for (let i = 1; i <= 20; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: bcrypt.hashSync("Password@123", 10),
      phoneNumber: 84090000000 + i,
      addresses: [makeAddress(i), makeAddress(i + 20)],
      role: i === 1 ? "Admin" : "user",
      avatar: image(`user-${i}`),
      createdAt: daysAgo(rand(10, 120)),
    });
  }
  return users;
}

function buildShops() {
  const shops = [];
  for (let i = 1; i <= 8; i++) {
    shops.push({
      name: `Shop ${i}`,
      email: `shop${i}@example.com`,
      password: bcrypt.hashSync("Shop@12345", 10),
      description: `Trusted multi-category seller #${i}`,
      address: `${10 + i} Le Loi, Ward ${i}, District ${i}, HCMC`,
      phoneNumber: 84910000000 + i,
      role: "Seller",
      avatar: image(`shop-${i}`),
      zipCode: 700000 + i,
      withdrawMethod: {
        bank: "Vietcombank",
        accountName: `Shop ${i}`,
        accountNumber: `9704${100000 + i}`,
      },
      availableBalance: rand(200, 2000),
      transections: [],
      createdAt: daysAgo(rand(20, 180)),
    });
  }
  return shops;
}

function buildProducts(shops) {
  const products = [];
  const sentences = [
    "High quality and durable for daily use.",
    "Best-in-class performance with sleek design.",
    "Eco-friendly materials, safe and reliable.",
    "Limited stock with exclusive discount.",
  ];
  shops.forEach((shop, sIdx) => {
    for (let j = 1; j <= 5; j++) {
      const cat = CATEGORIES[(sIdx + j) % CATEGORIES.length];
      const base = `${cat} Item ${j} by ${shop.name}`;
      const originalPrice = rand(30, 1200);
      const discount = rand(5, 30); // %
      const discountPrice = Math.max(
        5,
        Math.round(originalPrice * (100 - discount)) / 100
      );
      const stock = rand(10, 200);
      const sold = rand(0, Math.floor(stock / 2));

      products.push({
        _id: new mongoose.Types.ObjectId(),
        name: base,
        description: `${base}. ${pick(sentences)} ${pick(sentences)}`,
        category: cat,
        tags: slug(cat),
        originalPrice,
        discountPrice,
        stock,
        images: [image(base, 1), image(base, 2), image(base, 3)],
        reviews: [
          {
            user: {
              name: "Seed Reviewer",
              _id: new mongoose.Types.ObjectId().toString(),
            },
            rating: rand(3, 5),
            comment: "Great value for money.",
            productId: "NA",
            createdAt: daysAgo(rand(1, 60)),
          },
        ],
        ratings: rand(3, 5),
        shopId: shop._id.toString(),
        shop: {
          _id: shop._id.toString(),
          name: shop.name,
          avatar: shop.avatar,
          ratings: rand(3, 5),
        },
        sold_out: sold,
        createdAt: daysAgo(rand(5, 90)),
      });
    }
  });
  return products;
}

function buildCoupons(shops, products) {
  const coupons = [];
  for (let i = 1; i <= 10; i++) {
    const shop = pick(shops);
    const prod = pick(products.filter((p) => p.shopId === shop._id.toString()));
    coupons.push({
      name: `SAVE${10 + i}`,
      value: rand(5, 30),
      minAmount: rand(50, 300),
      maxAmount: rand(200, 1000),
      shopId: shop._id.toString(),
      selectedProduct: Math.random() > 0.5 ? prod._id.toString() : undefined,
      createdAt: daysAgo(rand(1, 40)),
    });
  }
  return coupons;
}

function buildEvents(shops) {
  const events = [];
  for (let i = 1; i <= 5; i++) {
    const shop = pick(shops);
    const cat = pick(CATEGORIES);
    const base = `Mega ${cat} Sale ${i}`;
    const originalPrice = rand(50, 1500);
    const discountPrice = Math.max(
      10,
      Math.round(originalPrice * (100 - rand(20, 60))) / 100
    );
    const start = daysAgo(rand(1, 20));
    const end = new Date(start.getTime() + rand(1, 15) * 24 * 3600 * 1000);

    events.push({
      name: base,
      description: `${base} across best-sellers.`,
      category: cat,
      start_Date: start,
      Finish_Date: end,
      status: "Running",
      tags: slug(cat),
      originalPrice,
      discountPrice,
      stock: rand(20, 300),
      images: [image(base, 1), image(base, 2)],
      reviews: [],
      ratings: rand(3, 5),
      shopId: shop._id.toString(),
      shop: { _id: shop._id.toString(), name: shop.name, avatar: shop.avatar },
      sold_out: rand(0, 50),
      createdAt: daysAgo(rand(1, 30)),
    });
  }
  return events;
}

function buildConversations(users, shops) {
  const convs = [];
  const msgs = [];
  for (let i = 1; i <= 10; i++) {
    const u = pick(users);
    const s = pick(shops);
    const title = `chat-${slug(u.name)}-x-${slug(s.name)}-${i}`;
    const convId = new mongoose.Types.ObjectId();

    const created = daysAgo(rand(1, 20));
    const updated = daysAgo(rand(0, 10));
    const m1 = {
      conversationId: convId.toString(),
      text: "Hi shop, is this item available?",
      sender: u._id.toString(),
      images: undefined,
      createdAt: created,
      updatedAt: created,
    };
    const m2 = {
      conversationId: convId.toString(),
      text: "Yes, we have it in stock!",
      sender: s._id.toString(),
      images: undefined,
      createdAt: updated,
      updatedAt: updated,
    };

    convs.push({
      _id: convId,
      groupTitle: title,
      members: [u._id.toString(), s._id.toString()],
      lastMessage: m2.text,
      lastMessageId: new mongoose.Types.ObjectId().toString(),
      createdAt: created,
      updatedAt: updated,
    });
    msgs.push(m1, m2);
  }
  return { convs, msgs };
}

function cartFromProducts(products, count = rand(1, 3)) {
  const chosen = [];
  const set = new Set();
  while (chosen.length < count) {
    const p = pick(products);
    if (set.has(p._id.toString())) continue;
    set.add(p._id.toString());
    const qty = rand(1, 3);
    chosen.push({ ...p, qty });
  }
  return chosen;
}

function buildOrders(users, products) {
  const orders = [];
  for (let i = 1; i <= 20; i++) {
    const user = pick(users);
    const cart = cartFromProducts(products, rand(1, 3));
    const subTotal = cart.reduce((a, it) => a + it.qty * it.discountPrice, 0);
    const shipping = Math.round(subTotal * 0.1 * 100) / 100;
    const totalPrice = Math.round((subTotal + shipping) * 100) / 100;

    const paidAt = daysAgo(rand(0, 15));
    const delivered = Math.random() > 0.5 ? daysAgo(rand(0, 10)) : undefined;

    orders.push({
      cart,
      shippingAddress: makeAddress(i),
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      totalPrice,
      status: delivered
        ? "Delivered"
        : pick(["Processing", "Transferred to delivery partner"]),
      paymentInfo: {
        id: `PAY-${100000 + i}`,
        status: delivered ? "Succeeded" : pick(["Pending", "Succeeded"]),
        type: pick(["Paypal", "Credit Card", "Cash On Delivery"]),
      },
      paidAt,
      deliveredAt: delivered,
      createdAt: daysAgo(rand(1, 20)),
    });
  }
  return orders;
}

function buildWithdraws(shops) {
  const ws = [];
  for (let i = 1; i <= 10; i++) {
    const shop = pick(shops);
    const amount = rand(50, 800);
    ws.push({
      seller: {
        _id: shop._id.toString(),
        name: shop.name,
        email: shop.email,
        avatar: shop.avatar,
        availableBalance: shop.availableBalance,
      },
      amount,
      status: pick(["Processing", "succeed"]),
      createdAt: daysAgo(rand(1, 25)),
      updatedAt: Math.random() > 0.5 ? daysAgo(rand(0, 10)) : undefined,
    });
  }
  return ws;
}

(async () => {
  try {
    await connect();
    await clearAll();

    // 1) Users & Shops
    const users = await User.insertMany(buildUsers());
    const shops = await Shop.insertMany(buildShops());

    // 2) Products (40)
    const products = buildProducts(shops);
    await Product.insertMany(products);

    // 3) Coupons (10)
    await CoupounCode.insertMany(buildCoupons(shops, products));

    // 4) Events (5)
    await Event.insertMany(buildEvents(shops));

    // 5) Conversations + Messages (10 convos, >=20 messages)
    const { convs, msgs } = buildConversations(users, shops);
    await Conversation.insertMany(convs);
    await Messages.insertMany(msgs);

    // 6) Orders (20)
    await Order.insertMany(buildOrders(users, products));

    // 7) Withdraw requests (10)
    await Withdraw.insertMany(buildWithdraws(shops));

    console.log("✅ Seed completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
})();
