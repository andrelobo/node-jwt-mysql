module.exports = (sequelize, DataTypes) => {
    const Todos = sequelize.define("Todos", {
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },            
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      prazo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    }});

    return Todos;
  };
  