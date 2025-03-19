import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'database_name',
    username: 'username',
    password: 'password',
});
class Users extends Model {
    id_user;
    login;
    password;
    role;
}
Users.init({
    id_user: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    login: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING }
}, { sequelize, modelName: 'users', timestamps: false });
class Stations extends Model {
    id_station;
    name_station;
    location;
}
Stations.init({
    id_station: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name_station: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING, unique: true }
}, { sequelize, modelName: 'stations', timestamps: false });
class Trains extends Model {
    id_train;
    number_train;
    type_train;
}
Trains.init({
    id_train: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    number_train: { type: DataTypes.TEXT },
    type_train: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'trains', timestamps: false });
class Passengers extends Model {
    id_user;
    id_passenger;
    first_name;
    last_name;
}
Passengers.init({
    id_user: { type: DataTypes.UUID, references: { model: Users, key: 'id_user' } },
    id_passenger: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    first_name: { type: DataTypes.TEXT },
    last_name: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'passengers', timestamps: false });
class Van extends Model {
    id_train;
    id_van;
    type;
    capacity;
}
Van.init({
    id_train: { type: DataTypes.UUID, references: { model: Trains, key: 'id_train' } },
    id_van: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    type: { type: DataTypes.TEXT },
    capacity: { type: DataTypes.INTEGER }
}, { sequelize, modelName: 'vans', timestamps: false });
class Tickets extends Model {
    id_passenger;
    number_van; // Это должно быть UUID
    id_ticket;
    place;
    category;
}
Tickets.init({
    id_passenger: { type: DataTypes.UUID, references: { model: Passengers, key: 'id_passenger' } },
    number_van: { type: DataTypes.UUID, references: { model: Van, key: 'id_van' } },
    id_ticket: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    place: { type: DataTypes.STRING },
    category: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'tickets', timestamps: false });
class Schedules extends Model {
    id_train;
    id_station;
    id_schedule;
    way;
    arrival_time;
    departure_time;
}
Schedules.init({
    id_train: { type: DataTypes.UUID, references: { model: Trains, key: 'id_train' } }, id_station: { type: DataTypes.UUID, references: { model: Stations, key: 'id_station' } },
    id_schedule: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    way: { type: DataTypes.INTEGER },
    arrival_time: { type: DataTypes.DATE },
    departure_time: { type: DataTypes.DATE }
}, { sequelize, modelName: 'schedules', timestamps: false });
// Определение связей
Users.hasMany(Passengers, {
    foreignKey: 'id_user',
});
Passengers.belongsTo(Users, {
    foreignKey: 'id_user',
});
Trains.hasMany(Van, {
    foreignKey: 'id_train',
});
Van.belongsTo(Trains, {
    foreignKey: 'id_train',
});
Van.hasMany(Tickets, {
    foreignKey: 'number_van',
});
Tickets.belongsTo(Van, {
    foreignKey: 'number_van',
});
Stations.hasMany(Schedules, {
    foreignKey: 'id_station',
});
Schedules.belongsTo(Stations, {
    foreignKey: 'id_station',
});
Trains.hasMany(Schedules, {
    foreignKey: 'id_train',
});
Schedules.belongsTo(Trains, {
    foreignKey: 'id_train',
});
Passengers.hasMany(Tickets, {
    foreignKey: 'id_passenger',
});
Tickets.belongsTo(Passengers, {
    foreignKey: 'id_passenger',
});
export { Users, Passengers, Tickets, Trains, Schedules, Van, Stations };
