// /* eslint-disable no-console */
// const path = require("path");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const dotenv = require("dotenv");

// dotenv.config({ path: path.join(__dirname, "..", "config", ".env") });

// const User = require("../model/user");
// const Shop = require("../model/shop");
// const Product = require("../model/product");
// const Order = require("../model/order");
// const CoupounCode = require("../model/coupounCode");
// const Event = require("../model/event");
// const Conversation = require("../model/conversation");
// const Messages = require("../model/messages");
// const Withdraw = require("../model/withdraw");

// // Danh mục theo UI
// const CATEGORIES = [
//   "Computers and Laptops",
//   "Cosmetics and Body Care",
//   "Accessories",
//   "Clothes",
//   "Shoes",
//   "Gifts",
//   "Pet Care",
//   "Mobile and Tablets",
//   "Music and Gaming",
//   "Others",
// ];

// const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// const pick = (arr) => arr[rand(0, arr.length - 1)];
// const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000);
// const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// // ảnh mẫu (đường dẫn tương đối trên server). Có thể thêm ảnh thật vào backend/uploads/seed/ để UI hiển thị đẹp.
// const image = (seed, i = 1) => `/uploads/seed/${slug(seed)}-${i}.jpg`;

// function makeAddress(idx) {
//   return {
//     country: "VN",
//     city: ["Hanoi", "HCM", "Danang"][idx % 3],
//     address1: `No. ${100 + idx} Nguyen Trai`,
//     address2: `Ward ${1 + (idx % 9)}, District ${1 + (idx % 5)}`,
//     zipCode: 100000 + idx,
//     addressType: idx % 2 === 0 ? "Home" : "Office",
//   };
// }

// async function connect() {
//   const uri = process.env.DB_URL;
//   if (!uri) throw new Error("Thiếu DB_URL trong config/.env");
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   console.log("Connected to MongoDB");
// }

// async function clearAll() {
//   await Promise.all([
//     User.deleteMany({}),
//     Shop.deleteMany({}),
//     Product.deleteMany({}),
//     Order.deleteMany({}),
//     CoupounCode.deleteMany({}),
//     Event.deleteMany({}),
//     Conversation.deleteMany({}),
//     Messages.deleteMany({}),
//     Withdraw.deleteMany({}),
//   ]);
// }

// function buildUsers() {
//   const users = [];
//   for (let i = 1; i <= 20; i++) {
//     users.push({
//       name: `User ${i}`,
//       email: `user${i}@example.com`,
//       password: bcrypt.hashSync("Password@123", 10),
//       phoneNumber: 84090000000 + i,
//       addresses: [makeAddress(i), makeAddress(i + 20)],
//       role: i === 1 ? "Admin" : "user",
//       avatar: image(`user-${i}`),
//       createdAt: daysAgo(rand(10, 120)),
//     });
//   }
//   return users;
// }

// function buildShops() {
//   const shops = [];
//   for (let i = 1; i <= 8; i++) {
//     shops.push({
//       name: `Shop ${i}`,
//       email: `shop${i}@example.com`,
//       password: bcrypt.hashSync("Shop@12345", 10),
//       description: `Trusted multi-category seller #${i}`,
//       address: `${10 + i} Le Loi, Ward ${i}, District ${i}, HCMC`,
//       phoneNumber: 84910000000 + i,
//       role: "Seller",
//       avatar: image(`shop-${i}`),
//       zipCode: 700000 + i,
//       withdrawMethod: {
//         bank: "Vietcombank",
//         accountName: `Shop ${i}`,
//         accountNumber: `9704${100000 + i}`,
//       },
//       availableBalance: rand(200, 2000),
//       transections: [],
//       createdAt: daysAgo(rand(20, 180)),
//     });
//   }
//   return shops;
// }

// function buildProducts(shops) {
//   const products = [];
//   const sentences = [
//     "High quality and durable for daily use.",
//     "Best-in-class performance with sleek design.",
//     "Eco-friendly materials, safe and reliable.",
//     "Limited stock with exclusive discount.",
//   ];
//   shops.forEach((shop, sIdx) => {
//     for (let j = 1; j <= 5; j++) {
//       const cat = CATEGORIES[(sIdx + j) % CATEGORIES.length];
//       const base = `${cat} Item ${j} by ${shop.name}`;
//       const originalPrice = rand(30, 1200);
//       const discount = rand(5, 30); // %
//       const discountPrice = Math.max(
//         5,
//         Math.round(originalPrice * (100 - discount)) / 100
//       );
//       const stock = rand(10, 200);
//       const sold = rand(0, Math.floor(stock / 2));

//       products.push({
//         _id: new mongoose.Types.ObjectId(),
//         name: base,
//         description: `${base}. ${pick(sentences)} ${pick(sentences)}`,
//         category: cat,
//         tags: slug(cat),
//         originalPrice,
//         discountPrice,
//         stock,
//         images: [image(base, 1), image(base, 2), image(base, 3)],
//         reviews: [
//           {
//             user: {
//               name: "Seed Reviewer",
//               _id: new mongoose.Types.ObjectId().toString(),
//             },
//             rating: rand(3, 5),
//             comment: "Great value for money.",
//             productId: "NA",
//             createdAt: daysAgo(rand(1, 60)),
//           },
//         ],
//         ratings: rand(3, 5),
//         shopId: shop._id.toString(),
//         shop: {
//           _id: shop._id.toString(),
//           name: shop.name,
//           avatar: shop.avatar,
//           ratings: rand(3, 5),
//         },
//         sold_out: sold,
//         createdAt: daysAgo(rand(5, 90)),
//       });
//     }
//   });
//   return products;
// }

// function buildCoupons(shops, products) {
//   const coupons = [];
//   for (let i = 1; i <= 10; i++) {
//     const shop = pick(shops);
//     const prod = pick(products.filter((p) => p.shopId === shop._id.toString()));
//     coupons.push({
//       name: `SAVE${10 + i}`,
//       value: rand(5, 30),
//       minAmount: rand(50, 300),
//       maxAmount: rand(200, 1000),
//       shopId: shop._id.toString(),
//       selectedProduct: Math.random() > 0.5 ? prod._id.toString() : undefined,
//       createdAt: daysAgo(rand(1, 40)),
//     });
//   }
//   return coupons;
// }

// function buildEvents(shops) {
//   const events = [];
//   for (let i = 1; i <= 5; i++) {
//     const shop = pick(shops);
//     const cat = pick(CATEGORIES);
//     const base = `Mega ${cat} Sale ${i}`;
//     const originalPrice = rand(50, 1500);
//     const discountPrice = Math.max(
//       10,
//       Math.round(originalPrice * (100 - rand(20, 60))) / 100
//     );
//     const start = daysAgo(rand(1, 20));
//     const end = new Date(start.getTime() + rand(1, 15) * 24 * 3600 * 1000);

//     events.push({
//       name: base,
//       description: `${base} across best-sellers.`,
//       category: cat,
//       start_Date: start,
//       Finish_Date: end,
//       status: "Running",
//       tags: slug(cat),
//       originalPrice,
//       discountPrice,
//       stock: rand(20, 300),
//       images: [image(base, 1), image(base, 2)],
//       reviews: [],
//       ratings: rand(3, 5),
//       shopId: shop._id.toString(),
//       shop: { _id: shop._id.toString(), name: shop.name, avatar: shop.avatar },
//       sold_out: rand(0, 50),
//       createdAt: daysAgo(rand(1, 30)),
//     });
//   }
//   return events;
// }

// function buildConversations(users, shops) {
//   const convs = [];
//   const msgs = [];
//   for (let i = 1; i <= 10; i++) {
//     const u = pick(users);
//     const s = pick(shops);
//     const title = `chat-${slug(u.name)}-x-${slug(s.name)}-${i}`;
//     const convId = new mongoose.Types.ObjectId();

//     const created = daysAgo(rand(1, 20));
//     const updated = daysAgo(rand(0, 10));
//     const m1 = {
//       conversationId: convId.toString(),
//       text: "Hi shop, is this item available?",
//       sender: u._id.toString(),
//       images: undefined,
//       createdAt: created,
//       updatedAt: created,
//     };
//     const m2 = {
//       conversationId: convId.toString(),
//       text: "Yes, we have it in stock!",
//       sender: s._id.toString(),
//       images: undefined,
//       createdAt: updated,
//       updatedAt: updated,
//     };

//     convs.push({
//       _id: convId,
//       groupTitle: title,
//       members: [u._id.toString(), s._id.toString()],
//       lastMessage: m2.text,
//       lastMessageId: new mongoose.Types.ObjectId().toString(),
//       createdAt: created,
//       updatedAt: updated,
//     });
//     msgs.push(m1, m2);
//   }
//   return { convs, msgs };
// }

// function cartFromProducts(products, count = rand(1, 3)) {
//   const chosen = [];
//   const set = new Set();
//   while (chosen.length < count) {
//     const p = pick(products);
//     if (set.has(p._id.toString())) continue;
//     set.add(p._id.toString());
//     const qty = rand(1, 3);
//     chosen.push({ ...p, qty });
//   }
//   return chosen;
// }

// function buildOrders(users, products) {
//   const orders = [];
//   for (let i = 1; i <= 20; i++) {
//     const user = pick(users);
//     const cart = cartFromProducts(products, rand(1, 3));
//     const subTotal = cart.reduce((a, it) => a + it.qty * it.discountPrice, 0);
//     const shipping = Math.round(subTotal * 0.1 * 100) / 100;
//     const totalPrice = Math.round((subTotal + shipping) * 100) / 100;

//     const paidAt = daysAgo(rand(0, 15));
//     const delivered = Math.random() > 0.5 ? daysAgo(rand(0, 10)) : undefined;

//     orders.push({
//       cart,
//       shippingAddress: makeAddress(i),
//       user: {
//         _id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//       },
//       totalPrice,
//       status: delivered
//         ? "Delivered"
//         : pick(["Processing", "Transferred to delivery partner"]),
//       paymentInfo: {
//         id: `PAY-${100000 + i}`,
//         status: delivered ? "Succeeded" : pick(["Pending", "Succeeded"]),
//         type: pick(["Paypal", "Credit Card", "Cash On Delivery"]),
//       },
//       paidAt,
//       deliveredAt: delivered,
//       createdAt: daysAgo(rand(1, 20)),
//     });
//   }
//   return orders;
// }

// function buildWithdraws(shops) {
//   const ws = [];
//   for (let i = 1; i <= 10; i++) {
//     const shop = pick(shops);
//     const amount = rand(50, 800);
//     ws.push({
//       seller: {
//         _id: shop._id.toString(),
//         name: shop.name,
//         email: shop.email,
//         avatar: shop.avatar,
//         availableBalance: shop.availableBalance,
//       },
//       amount,
//       status: pick(["Processing", "succeed"]),
//       createdAt: daysAgo(rand(1, 25)),
//       updatedAt: Math.random() > 0.5 ? daysAgo(rand(0, 10)) : undefined,
//     });
//   }
//   return ws;
// }

// (async () => {
//   try {
//     await connect();
//     await clearAll();

//     // 1) Users & Shops
//     const users = await User.insertMany(buildUsers());
//     const shops = await Shop.insertMany(buildShops());

//     // 2) Products (40)
//     const products = buildProducts(shops);
//     await Product.insertMany(products);

//     // 3) Coupons (10)
//     await CoupounCode.insertMany(buildCoupons(shops, products));

//     // 4) Events (5)
//     await Event.insertMany(buildEvents(shops));

//     // 5) Conversations + Messages (10 convos, >=20 messages)
//     const { convs, msgs } = buildConversations(users, shops);
//     await Conversation.insertMany(convs);
//     await Messages.insertMany(msgs);

//     // 6) Orders (20)
//     await Order.insertMany(buildOrders(users, products));

//     // 7) Withdraw requests (10)
//     await Withdraw.insertMany(buildWithdraws(shops));

//     console.log("✅ Seed completed successfully.");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Seed failed:", err);
//     process.exit(1);
//   }
// })();

/* ============================================================
   SEED-REALISTIC.JS — PART 1/5
   - Header, imports, DB helpers
   - Hand-crafted users (20) and shops (10)
   - All IDs use mongoose.Types.ObjectId()
   - All timestamps set within last 12 months
   ============================================================ */

/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "config", ".env") });

/**
 * NOTE:
 * - This file is designed to be a single file when parts 1..5 are concatenated in order.
 * - Models (User, Shop, Product...) are required in the final runner (part 5).
 * - For now we only create the data structures `seedData.users` and `seedData.shops`.
 */

/* ---------------------------
   Helpers
   --------------------------- */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000);
const iso = (d) =>
  d instanceof Date ? d.toISOString() : new Date(d).toISOString();
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const oid = () => new mongoose.Types.ObjectId();
const dateRecent = (days) => daysAgo(days);

/* ---------------------------
   DB connect / clear helpers
   (used by part 5 runner)
   --------------------------- */
async function connectDB() {
  const uri = process.env.DB_URL;
  if (!uri) {
    console.error(
      "Missing DB_URL in config/.env — please set it before running the seed script."
    );
    throw new Error("Missing DB_URL");
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
}

async function clearCollectionsIfExist(models) {
  // models: array of mongoose model classes — called by runner
  await Promise.all(models.map((m) => m.deleteMany({})));
  console.log("Cleared existing collections (if any).");
}

/* ---------------------------
   Global seed container
   --------------------------- */
const seedData = {
  users: [],
  shops: [],
  // products, reviews, orders, coupons, events, conversations, messages, withdraws
  // will be filled in later parts
};

/* ---------------------------
   Hand-crafted users (20)
   - 1 admin, 10 sellers, 9 buyers
   - realistic names, emails, addresses, avatars (Unsplash/pravatar)
   --------------------------- */
(function buildUsers() {
  const now = new Date();
  // Predefined 20 users (1 admin, 10 sellers, 9 buyers)
  const raw = [
    // Admin
    {
      firstName: "Trần",
      lastName: "Anh",
      role: "admin",
      username: "trananh",
      email: "admin@marketplace.test",
    },

    // Sellers (10)
    {
      firstName: "Nguyễn",
      lastName: "Hải",
      role: "seller",
      username: "nguyenhai",
      email: "hai@techstore.vn",
    },
    {
      firstName: "Lê",
      lastName: "Thu",
      role: "seller",
      username: "lethu",
      email: "thu@stylehouse.vn",
    },
    {
      firstName: "Phạm",
      lastName: "Long",
      role: "seller",
      username: "phamlong",
      email: "long@smartlife.vn",
    },
    {
      firstName: "Võ",
      lastName: "Mai",
      role: "seller",
      username: "voma i",
      email: "mai@beautycorner.vn",
    },
    {
      firstName: "Đỗ",
      lastName: "Tùng",
      role: "seller",
      username: "dotung",
      email: "tung@outdoorshop.vn",
    },
    {
      firstName: "Bùi",
      lastName: "Ngọc",
      role: "seller",
      username: "buingoc",
      email: "ngoc@homeliving.vn",
    },
    {
      firstName: "Hoàng",
      lastName: "Minh",
      role: "seller",
      username: "hoangminh",
      email: "minh@mobileplus.vn",
    },
    {
      firstName: "Trương",
      lastName: "Quỳnh",
      role: "seller",
      username: "truongquynh",
      email: "quynh@kidzplay.vn",
    },
    {
      firstName: "Phan",
      lastName: "Hương",
      role: "seller",
      username: "phanhuong",
      email: "huong@petcare.vn",
    },
    {
      firstName: "Đặng",
      lastName: "Khoa",
      role: "seller",
      username: "dangkhoa",
      email: "khoa@accessoriesvn.vn",
    },

    // Buyers (9)
    {
      firstName: "Lê",
      lastName: "Nam",
      role: "user",
      username: "lenam",
      email: "nam.user@example.com",
    },
    {
      firstName: "Ngô",
      lastName: "Hạnh",
      role: "user",
      username: "ngohanh",
      email: "hanh.user@example.com",
    },
    {
      firstName: "Trần",
      lastName: "Vy",
      role: "user",
      username: "tranvy",
      email: "vy.user@example.com",
    },
    {
      firstName: "Vũ",
      lastName: "Quân",
      role: "user",
      username: "vuquan",
      email: "quan.user@example.com",
    },
    {
      firstName: "Phùng",
      lastName: "An",
      role: "user",
      username: "phungan",
      email: "an.user@example.com",
    },
    {
      firstName: "Hoà",
      lastName: "Nguyên",
      role: "user",
      username: "hoanguyen",
      email: "nguyen.user@example.com",
    },
    {
      firstName: "Tạ",
      lastName: "Linh",
      role: "user",
      username: "tahlinh",
      email: "linh.user@example.com",
    },
    {
      firstName: "Nguyễn",
      lastName: "Duy",
      role: "user",
      username: "nguyenduy",
      email: "duy.user@example.com",
    },
    {
      firstName: "Huỳnh",
      lastName: "Mai",
      role: "user",
      username: "huynhmai",
      email: "huong.user@example.com",
    },
  ];

  // Avatars (Unsplash & pravatar fallback)
  const avatars = [
    // realistic portraits (unsplash source links)
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1545996124-61a1b6c7d6b8?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1545996124-61a1b6c7d6b8?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    // fallback / variety
    "https://i.pravatar.cc/300?img=10",
    "https://i.pravatar.cc/300?img=20",
    "https://i.pravatar.cc/300?img=30",
    "https://i.pravatar.cc/300?img=40",
    "https://i.pravatar.cc/300?img=50",
    "https://i.pravatar.cc/300?img=60",
    "https://i.pravatar.cc/300?img=70",
    "https://i.pravatar.cc/300?img=5",
    "https://i.pravatar.cc/300?img=8",
    "https://i.pravatar.cc/300?img=3",
  ];

  raw.forEach((r, idx) => {
    const _id = new mongoose.Types.ObjectId();
    const createdAt = daysAgo(randInt(5, 330));
    const user = {
      _id,
      firstName: r.firstName,
      lastName: r.lastName,
      name: `${r.firstName} ${r.lastName}`,
      username: r.username.replace(/\s+/g, "").toLowerCase(),
      email: r.email,
      password: bcrypt.hashSync(
        r.role === "admin"
          ? "Admin@12345"
          : r.role === "seller"
          ? "Seller@12345"
          : "User@12345",
        10
      ),
      role: r.role,
      phoneNumber: parseInt(`0${randInt(310000000, 399999999)}`),
      avatar: avatars[idx % avatars.length],
      addresses: [
        {
          country: "VN",
          city:
            idx % 3 === 0
              ? "Hà Nội"
              : idx % 3 === 1
              ? "Hồ Chí Minh"
              : "Đà Nẵng",
          address1: `${randInt(10, 300)} ${pick([
            "Nguyễn Trãi",
            "Lê Lợi",
            "Trần Hưng Đạo",
            "Điện Biên Phủ",
          ])}`,
          address2: `District ${randInt(1, 12)}`,
          zipCode: 100000 + idx,
          addressType: idx % 2 === 0 ? "Home" : "Office",
        },
      ],
      createdAt: iso(createdAt),
    };
    seedData.users.push(user);
  });
})();

/* ---------------------------
   Hand-crafted shops (10)
   - Each shop.owner_id references a seller user above
   - logos & banners use Unsplash curated images
   --------------------------- */
(function buildShops() {
  // find seller users in seedData (order preserved)
  const sellerUsers = seedData.users.filter((u) => u.role === "seller");
  if (sellerUsers.length < 10) {
    // defensive: ensure there are at least 10 sellers, but our users above include 10 sellers
    console.warn("Less than 10 sellers found — check users list.");
  }

  const logos = [
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80", // clean logo-like
    "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524587360495-1d4e0adc9b5f?auto=format&fit=crop&w=400&q=80",
  ];
  const banners = [
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1505691723518-36a5b3a2e3c6?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
  ];

  // curated shop data (10 shops)
  const rawShops = [
    {
      name: "TechStore VN",
      slug: "techstore-vn",
      ownerIndex: 1, // reference sellerUsers[0] (Nguyễn Hải)
      description:
        "TechStore VN cung cấp laptop, phụ kiện và thiết bị điện tử chính hãng. Bảo hành 12 tháng, đổi trả trong 7 ngày nếu lỗi nhà sản xuất. Giao hàng toàn quốc.",
      categories: [
        "Computers and Laptops",
        "Mobile and Tablets",
        "Accessories",
      ],
      phone: "028 7300 1001",
      hours: "Mon-Sat 09:00-18:00",
      address: "85 Lê Lợi, District 1, Hồ Chí Minh",
    },
    {
      name: "Style House",
      slug: "style-house",
      ownerIndex: 2,
      description:
        "Style House – thời trang nam nữ phong cách, chất liệu cao cấp. Freeship nội thành cho đơn hàng trên 500k. Chính sách đổi trả 14 ngày.",
      categories: ["Clothes", "Shoes", "Accessories"],
      phone: "024 3941 2002",
      hours: "Mon-Sun 10:00-20:00",
      address: "12 Tràng Tiền, Hoàn Kiếm, Hà Nội",
    },
    {
      name: "SmartLife Store",
      slug: "smartlife-store",
      ownerIndex: 3,
      description:
        "Các sản phẩm gia dụng thông minh – từ máy xay, nồi chiên không dầu đến robot hút bụi. Hỗ trợ kỹ thuật 24/7.",
      categories: ["Home & Kitchen", "Electronics"],
      phone: "028 7300 2003",
      hours: "Mon-Fri 08:30-17:30",
      address: "120 Nguyễn Thị Minh Khai, Quận 3, HCMC",
    },
    {
      name: "Beauty Corner",
      slug: "beauty-corner",
      ownerIndex: 4,
      description:
        "Beauty Corner – mỹ phẩm và chăm sóc da chính hãng, nhập khẩu. Tư vấn theo da miễn phí tại cửa hàng.",
      categories: ["Cosmetics and Body Care", "Accessories"],
      phone: "024 3736 3004",
      hours: "Mon-Sun 10:00-20:00",
      address: "45 Lý Thường Kiệt, Hà Nội",
    },
    {
      name: "Outdoor Pro",
      slug: "outdoor-pro",
      ownerIndex: 5,
      description:
        "Outdoor Pro chuyên đồ dã ngoại, trekking và camping. Chất liệu bền, phù hợp địa hình Việt Nam. Bảo hành theo chính sách nhà sản xuất.",
      categories: ["Sports & Outdoors", "Shoes"],
      phone: "028 7300 5005",
      hours: "Mon-Sat 09:00-18:00",
      address: "50 Võ Văn Tần, Quận 3, HCMC",
    },
    {
      name: "HomeLiving",
      slug: "homeliving",
      ownerIndex: 6,
      description:
        "HomeLiving – nội thất nhỏ và đồ dùng nhà bếp. Thiết kế tối giản, dễ phối đồ cho mọi không gian.",
      categories: ["Home & Kitchen", "Office Supplies"],
      phone: "0236 356 6006",
      hours: "Mon-Fri 09:00-17:00",
      address: "20 Trần Phú, Đà Nẵng",
    },
    {
      name: "MobilePlus",
      slug: "mobileplus",
      ownerIndex: 7,
      description:
        "MobilePlus – điện thoại, tablet, phụ kiện. Hàng chính hãng, hỗ trợ trả góp, thu cũ đổi mới.",
      categories: ["Mobile and Tablets", "Accessories", "Electronics"],
      phone: "028 7300 7007",
      hours: "Mon-Sun 10:00-20:00",
      address: "200 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    },
    {
      name: "KidzPlay",
      slug: "kidzplay",
      ownerIndex: 8,
      description:
        "KidzPlay – đồ chơi giáo dục, đồ chơi an toàn cho bé. Kiểm định an toàn, phù hợp nhiều độ tuổi.",
      categories: ["Toys & Games", "Gifts"],
      phone: "028 7300 8008",
      hours: "Mon-Sat 09:00-18:00",
      address: "88 Phan Đình Phùng, Đà Nẵng",
    },
    {
      name: "PetCare VN",
      slug: "petcare-vn",
      ownerIndex: 9,
      description:
        "PetCare cung cấp thức ăn, phụ kiện và dược phẩm cho thú cưng. Tư vấn dinh dưỡng cá nhân hóa.",
      categories: ["Pet Care", "Groceries"],
      phone: "028 7300 9009",
      hours: "Mon-Sun 09:00-19:00",
      address: "150 Nguyễn Huệ, Quận 1, HCMC",
    },
    {
      name: "Accessories VN",
      slug: "accessories-vn",
      ownerIndex: 10,
      description:
        "Phụ kiện thời trang & công nghệ: ví, túi, ốp lưng, sạc dự phòng. Giá tốt cho khách sỉ & lẻ.",
      categories: ["Accessories", "Electronics"],
      phone: "024 3941 1010",
      hours: "Mon-Fri 09:00-18:00",
      address: "10 Hai Bà Trưng, Hà Nội",
    },
  ];

  rawShops.forEach((rs, idx) => {
    const ownerUser = sellerUsers[rs.ownerIndex - 1]; // ownerIndex in raw is 1-based
    const _id = new mongoose.Types.ObjectId();
    const createdAt = daysAgo(randInt(10, 300));
    const shop = {
      _id,
      name: rs.name,
      description: rs.description,
      email:
        rs.ownerIndex && ownerUser
          ? ownerUser.email
          : `shop${idx + 1}@example.com`,
      password: bcrypt.hashSync("Shop@12345", 10),
      phoneNumber: parseInt(rs.phone.replace(/\D/g, "")) || 84910000000 + idx,
      address: rs.address,
      zipCode: 100000 + idx,
      avatar: logos[idx % logos.length],
      createdAt: iso(createdAt),
      availableBalance: randInt(5000000, 30000000), // in VND
    };
    seedData.shops.push(shop);
  });
})();

/* ---------------------------
   Export PART 1 data object for concatenation
   (When final file assembled, seedData will be used to insert into DB)
   --------------------------- */

console.log(
  "PART 1/5: Built users and shops. Users:",
  seedData.users.length,
  "Shops:",
  seedData.shops.length
);

// The following line is harmless in single-file final version.
// It helps if you run parts as separate files for inspection.
module.exports = module.exports || {};
module.exports.part1 = {
  seedDataPartial: { users: seedData.users, shops: seedData.shops },
};

/* End of PART 1/5 */
// ============================================================================
// PART 2 - PRODUCTS (REALISTIC, UNSPLASH IMAGES, FULL DETAILS)
// ============================================================================

const makeSKU = (shopCode, index) =>
  `SKU-${shopCode}-${String(index).padStart(4, "0")}`;
const makeSlug = (str) => str.toLowerCase().replace(/\s+/g, "-");

// Helper images (Unsplash) - commented out detailed products section
// Using buildProducts() function instead which matches the model schema

// Detailed products section removed - using buildProducts() function below

function buildProducts(shops) {
  const products = [];

  // 12 categories chuẩn thương mại
  const CATEGORIES = [
    { name: "Laptops", tag: "laptop", img: "laptop" },
    { name: "Smartphones", tag: "smartphone", img: "smartphone" },
    { name: "Headphones", tag: "headphones", img: "headphone" },
    { name: "Furniture", tag: "furniture", img: "furniture" },
    { name: "Shoes", tag: "shoes", img: "shoe" },
    { name: "Watches", tag: "watch", img: "watch" },
    { name: "Gaming Gear", tag: "gaming", img: "gaming" },
    { name: "Cameras", tag: "camera", img: "camera" },
    { name: "Cosmetics", tag: "cosmetics", img: "cosmetic" },
    { name: "Backpacks", tag: "backpack", img: "backpack" },
    { name: "Home Decor", tag: "decor", img: "decor" },
    { name: "Sports", tag: "sports", img: "sport" },
  ];

  const DESCRIPTIONS = [
    "Premium build quality, designed for long-lasting performance.",
    "Top-rated product chosen by thousands of customers.",
    "Made with eco-friendly and high-grade materials.",
    "Best value in its category with excellent reliability.",
    "Limited stock available. Fast shipping nationwide.",
  ];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pickLocal = (arr) => arr[rand(0, arr.length - 1)];
  const daysAgoLocal = (d) => new Date(Date.now() - d * 24 * 3600 * 1000);

  // Product images by category - specific images that match the product type
  const productImages = {
    laptop: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", // laptop main
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80", // laptop angle
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80", // laptop keyboard
    ],
    smartphone: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", // phone front
      "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=900&q=80", // phone side
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80", // phone detail
    ],
    headphone: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", // headphones main
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=900&q=80", // headphones detail
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80", // headphones angle
    ],
    furniture: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80", // furniture main
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80", // furniture detail
      "https://images.unsplash.com/photo-1551292831-023188e78222?auto=format&fit=crop&w=900&q=80", // furniture angle
    ],
    shoe: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", // shoes main
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80", // shoes side
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80", // shoes detail
    ],
    watch: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", // watch main
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80", // watch detail
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80", // watch angle
    ],
    gaming: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80", // gaming setup
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80", // gaming keyboard
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80", // gaming mouse
    ],
    camera: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80", // camera main
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80", // camera detail
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80", // camera angle
    ],
    cosmetic: [
      "https://images.unsplash.com/photo-1596464716127-fb0f090a4b1a?auto=format&fit=crop&w=900&q=80", // cosmetics main
      "https://images.unsplash.com/photo-1585238341986-037c97fbd236?auto=format&fit=crop&w=900&q=80", // cosmetics detail
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80", // cosmetics set
    ],
    backpack: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", // backpack main
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80", // backpack detail
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80", // backpack angle
    ],
    decor: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80", // home decor main
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?auto=format&fit=crop&w=900&q=80", // home decor detail
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80", // home decor set
    ],
    sport: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80", // sports gear main
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80", // sports gear detail
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80", // sports gear set
    ],
  };

  const getProductImages = (categoryImg) => {
    const imgKey = categoryImg.toLowerCase();
    if (productImages[imgKey]) {
      return [...productImages[imgKey]]; // return copy of array
    }
    // fallback to laptop images if category not found
    return [...productImages.laptop];
  };

  shops.forEach((shop, shopIndex) => {
    for (let i = 1; i <= 12; i++) {
      const cat = pickLocal(CATEGORIES);

      const name = `${cat.name} Model ${shopIndex + 1}${i}`;
      const base = `${cat.name} ${i}`;
      const originalPrice = rand(20, 2000);
      const discount = rand(5, 40);
      const discountPrice = Math.round(originalPrice * (1 - discount / 100));

      const stock = rand(20, 200);
      const sold = rand(0, Math.floor(stock / 1.6));

      products.push({
        _id: new mongoose.Types.ObjectId(),
        name,
        description: `${base}. ${pickLocal(DESCRIPTIONS)} ${pickLocal(
          DESCRIPTIONS
        )}`,
        category: cat.name,
        tags: cat.tag,
        originalPrice,
        discountPrice,
        stock,
        sold_out: sold,
        images: getProductImages(cat.img),
        reviews: [
          {
            user: {
              name: "Customer Review",
              _id: new mongoose.Types.ObjectId().toString(),
            },
            rating: rand(3, 5),
            comment: "Satisfied with the quality. Recommended!",
            productId: "NA",
            createdAt: daysAgoLocal(rand(0, 60)),
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
        createdAt: daysAgoLocal(rand(5, 100)),
      });
    }
  });

  return products;
}

// Remove duplicate buildProducts - keeping only the one above
// All detailed products.push() calls removed - using buildProducts() function instead

function buildCoupons(shops, products) {
  const coupons = [];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000);

  const couponNames = [
    "WELCOME10",
    "SAVE15",
    "FLASH20",
    "MEGA25",
    "HOT30",
    "SUMMER15",
    "WINTER20",
    "FREESHIP5",
    "LUNAR10",
    "BIGSALE40",
    "SHOPLOVE12",
    "SUPERDEAL18",
    "NEWUSER22",
    "BUYMORE14",
    "PAYLESS16",
    "VIPMEMBER20",
    "PROMO24",
    "HOLIDAY28",
    "BRANDOFF12",
    "DEALOFWEEK30",
  ];

  let index = 0;

  for (let i = 0; i < 20; i++) {
    const shop = pick(shops);

    const couponName = couponNames[index % couponNames.length];
    index++;

    const minAmount = rand(50, 300);
    const discountValue = rand(5, 40);
    const maxAmount = minAmount + rand(50, 400);

    const isSpecificProduct = Math.random() > 0.5;

    const targetProduct = isSpecificProduct
      ? pick(products.filter((p) => p.shopId === shop._id.toString()))
      : null;

    coupons.push({
      name: couponName,
      value: discountValue,
      minAmount,
      maxAmount,
      shopId: shop._id.toString(),
      selectedProduct: targetProduct ? targetProduct._id.toString() : undefined,
      createdAt: daysAgo(rand(2, 40)),
      expiresAt: daysAgo(-rand(5, 30)), // ngày hết hạn trong tương lai
    });
  }

  return coupons;
}

function buildEvents(shops) {
  const events = [];

  const CATEGORIES = [
    { name: "Laptops", tag: "laptop", img: "laptop sale" },
    { name: "Smartphones", tag: "smartphone", img: "smartphone promotion" },
    { name: "Fashion", tag: "fashion", img: "clothes sale" },
    { name: "Shoes", tag: "shoes", img: "shoe store" },
    { name: "Furniture", tag: "furniture", img: "furniture sale" },
    { name: "Cosmetics", tag: "cosmetics", img: "cosmetic product" },
    { name: "Home Decor", tag: "decor", img: "home decor" },
    { name: "Sports", tag: "sport", img: "sport gear sale" },
  ];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000);

  // Event images by category - matching product categories
  const eventImages = {
    "laptop sale": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    ],
    "smartphone promotion": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
    ],
    "clothes sale": [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1520974735194-46c6ca00439c?auto=format&fit=crop&w=1000&q=80",
    ],
    "shoe store": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80",
    ],
    "furniture sale": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551292831-023188e78222?auto=format&fit=crop&w=1000&q=80",
    ],
    "cosmetic product": [
      "https://images.unsplash.com/photo-1596464716127-fb0f090a4b1a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1585238341986-037c97fbd236?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
    ],
    "home decor": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1000&q=80",
    ],
    "sport gear sale": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1000&q=80",
    ],
  };

  const getEventImages = (imgKey) => {
    if (eventImages[imgKey]) {
      return [...eventImages[imgKey]];
    }
    // fallback
    return [...eventImages["laptop sale"]];
  };

  for (let i = 1; i <= 10; i++) {
    const shop = pick(shops);
    const cat = pick(CATEGORIES);

    const base = `${cat.name} Flash Sale ${i}`;
    const original = rand(30, 2000);
    const discountPercent = rand(25, 70);
    const discount = Math.max(
      10,
      Math.round(original * (1 - discountPercent / 100))
    );

    const start = daysAgo(rand(0, 3)); // đang chạy
    const end = daysAgo(-rand(2, 12)); // tương lai

    events.push({
      name: base,
      description: `${base} – Up to ${discountPercent}% off for a limited time.`,
      category: cat.name,
      tags: cat.tag,
      start_Date: start,
      Finish_Date: end,
      status: "Running",
      originalPrice: original,
      discountPrice: discount,
      stock: rand(20, 300),
      images: getEventImages(cat.img),
      ratings: rand(3, 5),
      reviews: [],
      sold_out: rand(0, 50),
      shopId: shop._id.toString(),
      shop: {
        _id: shop._id.toString(),
        name: shop.name,
        avatar: shop.avatar,
      },
      createdAt: daysAgo(rand(1, 20)),
    });
  }

  return events;
}

// ============================================================================
// RUNNER SECTION - Insert data into database
// ============================================================================

const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");
const Order = require("../model/order");
const CoupounCode = require("../model/coupounCode");
const Event = require("../model/event");
const Conversation = require("../model/conversation");
const Messages = require("../model/messages");
const Withdraw = require("../model/withdraw");

(async () => {
  try {
    await connectDB();
    await clearCollectionsIfExist([
      User,
      Shop,
      Product,
      Order,
      CoupounCode,
      Event,
      Conversation,
      Messages,
      Withdraw,
    ]);

    // 1) Insert Users & Shops
    const users = await User.insertMany(seedData.users);
    const shops = await Shop.insertMany(seedData.shops);

    // 2) Build and insert Products
    const products = buildProducts(shops);
    await Product.insertMany(products);

    // 3) Build and insert Coupons
    const coupons = buildCoupons(shops, products);
    await CoupounCode.insertMany(coupons);

    // 4) Build and insert Events
    const events = buildEvents(shops);
    await Event.insertMany(events);

    console.log("✅ Seed completed successfully.");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Shops: ${shops.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Coupons: ${coupons.length}`);
    console.log(`   - Events: ${events.length}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
})();
