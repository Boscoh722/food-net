import json, zipfile, io, random
from datetime import datetime, timedelta

# === Helper functions ===
def oid(i): return f"6735e0000000000000000{i:03d}"
def dt(offset): return (datetime(2025,1,1)+timedelta(days=offset)).isoformat()+'Z'

# === Users ===
roles = ["buyer","buyer","seller","seller","seller","logistics","logistics"]
names = [
    "Admin User","Grace Wanjiru","James Otieno","Mary Chebet","Peter Mwangi","Lilian Achieng","Joseph Njoroge",
    "Esther Wekesa","David Karanja","Catherine Nyambura","Samuel Kiptoo","Naomi Muthoni","Brian Omondi",
    "Beatrice Cherono","George Kimani","Irene Wairimu","Dennis Ochieng","Patricia Mwikali","Hassan Noor","Mercy Naliaka"
]

users=[]
for i,name in enumerate(names,1):
    role = "admin" if i==1 else random.choice(roles)
    users.append({
        "_id":{"$oid":oid(i)},
        "name":name,
        "email":name.lower().replace(" ",".")+"@foodnet.com",
        "password":"$2a$10$examplehashpass",  # placeholder hash
        "role":role,
        "phone":f"+2547{random.randint(10,99)}{random.randint(100000,999999)}",
        "location":random.choice(["Nairobi","Kisumu","Eldoret","Nakuru","Thika","Kisii","Mombasa"])+", Kenya",
        "reach":"Nationwide" if role=="logistics" else None,
        "createdAt":{"$date":dt(i*3)}
    })

# === Products ===
categories=["Vegetables","Fruits","Grains","Tubers","Dairy","Poultry","Honey","Legumes"]
sample_products=["Tomatoes","Kale","Cabbage","Onions","Carrots","Maize","Beans","Milk","Eggs","Honey","Oranges","Bananas","Potatoes","Sweet Potatoes","Groundnuts","Rice","Spinach","Mangoes","Avocados","Pawpaw"]
products=[]
pid=101
for i in range(60):
    name=random.choice(sample_products)
    products.append({
        "_id":{"$oid":oid(pid+i)},
        "name":f"{name} ({random.randint(1,50)}kg pack)",
        "category":random.choice(categories),
        "price":random.randint(50,5000),
        "quantity":random.randint(20,500),
        "sellerId":{"$oid":random.choice([u["_id"]["$oid"] for u in users if u["role"]=="seller"])} ,
        "image":f"https://res.cloudinary.com/demo/image/upload/{name.lower().replace(' ','_')}.jpg",
        "description":f"Fresh {name.lower()} sourced from local Kenyan farms.",
        "createdAt":{"$date":dt(60+i)}
    })

# === Orders ===
orders=[]
for i in range(20):
    buyer=random.choice([u for u in users if u["role"]=="buyer"])
    logistics=random.choice([u for u in users if u["role"]=="logistics"])
    items=[{"productId":{"$oid":random.choice(products)["_id"]["$oid"]},"quantity":random.randint(1,10)} for _ in range(random.randint(1,3))]
    total=sum([p["quantity"]*random.randint(100,500) for p in items])
    orders.append({
        "_id":{"$oid":oid(201+i)},
        "buyerId":{"$oid":buyer["_id"]["$oid"]},
        "products":items,
        "total":total,
        "status":random.choice(["pending","in_transit","delivered"]),
        "logisticsId":{"$oid":logistics["_id"]["$oid"]},
        "createdAt":{"$date":dt(120+i)}
    })

# === Write ZIP file ===
with zipfile.ZipFile("foodnet_testdata.zip", "w", zipfile.ZIP_DEFLATED) as zf:
    zf.writestr("users.json", json.dumps(users, indent=2))
    zf.writestr("products.json", json.dumps(products, indent=2))
    zf.writestr("orders.json", json.dumps(orders, indent=2))

print("✅ Created foodnet_testdata.zip with users, products, and orders JSON files!")
