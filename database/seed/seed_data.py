import asyncio
import logging
import os
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models import (
    User, UserRole, Location, Property, PropertyType, PropertyStatus,
    VerificationStatus, FurnishingStatus, LandAreaUnit, Amenity,
    PropertyAmenity, PropertyMedia, MediaType
)
from app.utils.helpers import normalize_land_area_to_sqft, generate_slug

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")


async def seed_database():
    if os.getenv("ENVIRONMENT", "development").lower() == "production":
        raise RuntimeError(
            "Demo seed data is disabled in production because it contains sample accounts. "
            "Create the first administrator with app.scripts.create_admin instead."
        )
    logger.info("Initializing database schema...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if users already exist
        result = await session.execute(select(User))
        existing_user = result.scalars().first()
        if existing_user:
            logger.info("Database already seeded. Skipping.")
            return

        logger.info("Seeding initial users (Admin, Sellers, Buyers)...")
        # 1. Users
        admin_user = User(
            email="admin@farmhousemarketplace.in",
            hashed_password=get_password_hash("AdminPass123!"),
            full_name="Rajiv Malhotra (Platform Admin)",
            phone="+919876543210",
            role=UserRole.ADMIN,
            is_verified=True
        )

        seller_user1 = User(
            email="vikram.singh@royalestates.in",
            hashed_password=get_password_hash("SellerPass123!"),
            full_name="Vikramaditya Singh",
            phone="+919811223344",
            role=UserRole.SELLER,
            is_verified=True
        )

        seller_user2 = User(
            email="priya.sharma@luxuryfarmhouses.com",
            hashed_password=get_password_hash("SellerPass123!"),
            full_name="Priya Sharma",
            phone="+919899887766",
            role=UserRole.SELLER,
            is_verified=True
        )

        buyer_user = User(
            email="buyer@gmail.com",
            hashed_password=get_password_hash("BuyerPass123!"),
            full_name="Ananya Roy",
            phone="+919711002233",
            role=UserRole.BUYER,
            is_verified=True
        )

        session.add_all([admin_user, seller_user1, seller_user2, buyer_user])
        await session.flush()

        # 2. Amenities
        logger.info("Seeding amenities...")
        amenities_data = [
            ("Swimming Pool", "Outdoors", "pool"),
            ("Private Lawn / Garden", "Outdoors", "tree"),
            ("24x7 Security & CCTV", "Safety", "shield"),
            ("100% Power Backup", "Utilities", "zap"),
            ("Borewell / Continuous Water", "Utilities", "droplet"),
            ("Servant Quarter", "Staff", "user-check"),
            ("Guest House / Cottage", "Structures", "home"),
            ("Boundary Wall & Gated Entry", "Safety", "lock"),
            ("Home Theatre", "Entertainment", "tv"),
            ("Private Gym & Spa", "Wellness", "activity"),
            ("Terrace Garden / Pavilion", "Outdoors", "sun"),
            ("Organic Orchard & Trees", "Nature", "leaf"),
            ("Gazebo & BBQ Deck", "Outdoors", "coffee"),
            ("Covered Car Parking (6+ Cars)", "Vehicles", "car"),
        ]

        amenity_objs = []
        for name, category, icon in amenities_data:
            a = Amenity(name=name, category=category, icon=icon)
            session.add(a)
            amenity_objs.append(a)
        await session.flush()

        # 3. Locations
        logger.info("Seeding prime locations...")
        locations_data = [
            Location(
                state="Delhi NCR", city="Delhi", locality="Chhatarpur",
                address="DLF Farms, Ansal Villa Zone, Chhatarpur", pincode="110074",
                latitude=28.4983, longitude=77.1802,
                nearby_places=[
                    {"category": "Highway", "name": "Mehrauli-Gurgaon Road", "distance": "2.5 km"},
                    {"category": "Airport", "name": "IGI Airport T3", "distance": "14 km"},
                    {"category": "Hospital", "name": "Fortis Hospital Vasant Kunj", "distance": "6 km"},
                ]
            ),
            Location(
                state="Delhi NCR", city="Gurgaon", locality="Golf Course Extension Road",
                address="Baliawas Farmhouse Zone, Off Golf Course Ext Rd", pincode="122003",
                latitude=28.4215, longitude=77.1128,
                nearby_places=[
                    {"category": "Highway", "name": "Golf Course Road Expressway", "distance": "1.0 km"},
                    {"category": "Airport", "name": "IGI Airport", "distance": "18 km"},
                    {"category": "Club", "name": "DLF Golf & Country Club", "distance": "4 km"},
                ]
            ),
            Location(
                state="Maharashtra", city="Alibaug", locality="Mandwa Coastal Belt",
                address="Awas Beach Road, Mandwa Jetty Zone", pincode="402201",
                latitude=18.7758, longitude=72.8682,
                nearby_places=[
                    {"category": "Transport", "name": "Mandwa Speedboat Jetty", "distance": "1.8 km"},
                    {"category": "Beach", "name": "Awas Beach", "distance": "500 meters"},
                ]
            ),
            Location(
                state="Goa", city="North Goa", locality="Assagao",
                address="Badem Road, Near Sublime Villa Belt", pincode="403507",
                latitude=15.5906, longitude=73.7661,
                nearby_places=[
                    {"category": "Beach", "name": "Vagator Beach", "distance": "3.2 km"},
                    {"category": "Restaurant", "name": "Sublime & Gunpowder", "distance": "800 meters"},
                    {"category": "Airport", "name": "Mopa International Airport", "distance": "26 km"},
                ]
            ),
            Location(
                state="Maharashtra", city="Lonavala", locality="Tungarli Hills",
                address="Private Hillside Estate, Tungarli", pincode="410401",
                latitude=18.7612, longitude=73.4184,
                nearby_places=[
                    {"category": "Highway", "name": "Mumbai-Pune Expressway", "distance": "4 km"},
                    {"category": "Lake", "name": "Tungarli Lake", "distance": "1.2 km"},
                ]
            )
        ]
        for loc in locations_data:
            session.add(loc)
        await session.flush()

        # 4. Properties
        logger.info("Seeding properties...")
        props_data = [
            {
                "title": "The Royal Oasis - Grand 2.5 Acre Chhatarpur Farmhouse",
                "description": "An architectural masterpiece nestled in 2.5 acres of manicured green lawns, mature fruit orchards, and water features. Features a 6-bedroom ultra-luxury mansion, Olympic-length infinity swimming pool, separate guest cottage, and state-of-the-art security.",
                "property_type": PropertyType.FARMHOUSE,
                "price": 280000000.0, # 28 Crore
                "land_area_value": 2.5,
                "land_area_unit": LandAreaUnit.ACRE,
                "built_up_area_sqft": 14500.0,
                "bedrooms": 6,
                "bathrooms": 7,
                "furnishing": FurnishingStatus.FULLY_FURNISHED,
                "facing": "North-East",
                "construction_age": "1-3 Years",
                "status": PropertyStatus.AVAILABLE,
                "verification_status": VerificationStatus.VERIFIED,
                "is_featured": True,
                "owner_id": seller_user1.id,
                "location_id": locations_data[0].id,
                "images": [
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
                ]
            },
            {
                "title": "Golf View Modern Estate Villa",
                "description": "Ultra-contemporary luxury estate bungalow overlooking lush green expanses. Comes with private heated swimming pool, double-height living room, Italian marble flooring, imported modular kitchen, and smart home automation.",
                "property_type": PropertyType.ESTATE,
                "price": 185000000.0, # 18.5 Crore
                "land_area_value": 1.2,
                "land_area_unit": LandAreaUnit.ACRE,
                "built_up_area_sqft": 10200.0,
                "bedrooms": 5,
                "bathrooms": 6,
                "furnishing": FurnishingStatus.FULLY_FURNISHED,
                "facing": "East",
                "construction_age": "Under 1 Year",
                "status": PropertyStatus.AVAILABLE,
                "verification_status": VerificationStatus.VERIFIED,
                "is_featured": True,
                "owner_id": seller_user2.id,
                "location_id": locations_data[1].id,
                "images": [
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                ]
            },
            {
                "title": "Mandwa Beachfront Tropical Villa",
                "description": "Exclusive coastal retreat in Alibaug just 10 minutes from Mandwa Jetty. Built with Balinese teakwood aesthetics, vast coconut groves, expansive swimming pool, and private access pathway to Awas Beach.",
                "property_type": PropertyType.VILLA,
                "price": 140000000.0, # 14 Crore
                "land_area_value": 15000.0,
                "land_area_unit": LandAreaUnit.SQYD,
                "built_up_area_sqft": 8500.0,
                "bedrooms": 4,
                "bathrooms": 5,
                "furnishing": FurnishingStatus.FULLY_FURNISHED,
                "facing": "West",
                "construction_age": "3-5 Years",
                "status": PropertyStatus.AVAILABLE,
                "verification_status": VerificationStatus.VERIFIED,
                "is_featured": True,
                "owner_id": seller_user1.id,
                "location_id": locations_data[2].id,
                "images": [
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80"
                ]
            },
            {
                "title": "Portuguese Heritage Luxury Bungalow",
                "description": "Restored 150-year-old Portuguese mansion in fashionable Assagao. Features high vaulted wooden ceilings, courtyard swimming pool, lush tropical gardens, and bespoke artisanal furnishings.",
                "property_type": PropertyType.LUXURY_BUNGALOW,
                "price": 115000000.0, # 11.5 Crore
                "land_area_value": 1200.0,
                "land_area_unit": LandAreaUnit.SQYD,
                "built_up_area_sqft": 6200.0,
                "bedrooms": 4,
                "bathrooms": 4,
                "furnishing": FurnishingStatus.FULLY_FURNISHED,
                "facing": "North",
                "construction_age": "Historical / Restored",
                "status": PropertyStatus.AVAILABLE,
                "verification_status": VerificationStatus.VERIFIED,
                "is_featured": False,
                "owner_id": seller_user2.id,
                "location_id": locations_data[3].id,
                "images": [
                    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80"
                ]
            },
            {
                "title": "Tungarli Hilltop Mist Weekend Farmhouse",
                "description": "Perched atop the highest elevation in Tungarli with panoramic lake and valley views. Features expansive outdoor decks, glass-wrapped living spaces, infinity pool, and private pine trees orchard.",
                "property_type": PropertyType.WEEKEND_HOME,
                "price": 85000000.0, # 8.5 Crore
                "land_area_value": 0.8,
                "land_area_unit": LandAreaUnit.ACRE,
                "built_up_area_sqft": 5400.0,
                "bedrooms": 4,
                "bathrooms": 4,
                "furnishing": FurnishingStatus.SEMI_FURNISHED,
                "facing": "East",
                "construction_age": "1-3 Years",
                "status": PropertyStatus.AVAILABLE,
                "verification_status": VerificationStatus.VERIFIED,
                "is_featured": False,
                "owner_id": seller_user1.id,
                "location_id": locations_data[4].id,
                "images": [
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
                ]
            }
        ]

        for idx, pdata in enumerate(props_data):
            normalized_sqft = normalize_land_area_to_sqft(pdata["land_area_value"], pdata["land_area_unit"].value)
            prop = Property(
                title=pdata["title"],
                slug=generate_slug(pdata["title"], f"prop-{idx+1}"),
                description=pdata["description"],
                property_type=pdata["property_type"],
                price=pdata["price"],
                land_area_value=pdata["land_area_value"],
                land_area_unit=pdata["land_area_unit"],
                land_area_sqft_normalized=normalized_sqft,
                built_up_area_sqft=pdata["built_up_area_sqft"],
                bedrooms=pdata["bedrooms"],
                bathrooms=pdata["bathrooms"],
                furnishing=pdata["furnishing"],
                facing=pdata["facing"],
                construction_age=pdata["construction_age"],
                status=pdata["status"],
                verification_status=pdata["verification_status"],
                is_featured=pdata["is_featured"],
                owner_id=pdata["owner_id"],
                location_id=pdata["location_id"],
            )
            session.add(prop)
            await session.flush()

            # Add media
            for img_idx, img_url in enumerate(pdata["images"]):
                pm = PropertyMedia(
                    property_id=prop.id,
                    media_type=MediaType.IMAGE,
                    url=img_url,
                    is_primary=(img_idx == 0),
                    display_order=img_idx
                )
                session.add(pm)

            # Add amenities to property
            for am in amenity_objs[:8]:  # Attach top 8 amenities
                pa = PropertyAmenity(property_id=prop.id, amenity_id=am.id)
                session.add(pa)

        await session.commit()
        logger.info("Successfully seeded database with initial luxury real-estate records!")


if __name__ == "__main__":
    asyncio.run(seed_database())
