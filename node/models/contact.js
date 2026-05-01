const serverAddress = `${process.env.URL}`;
let staticPath = `/uploads/contact/`;

module.exports = (sequelize, DataTypes) => {
  const ContactDetail = sequelize.define(
    "contactDetail",
    {
      primaryContact: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "primary_contact",
      },
      primaryEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "primary_email",
      },
      socialProfiles: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "social_profiles",
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "address",
      },
      logoFile: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "logo_file",
      },
      logo: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.logoFile ? `${serverAddress}${staticPath}${this.logoFile}` : null;
        }
      },
    },
    {
      tableName: "contact_details",
      timestamps: true,
    }
  );

  return ContactDetail;
};