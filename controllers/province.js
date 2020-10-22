const mongoose = require("mongoose");

const Province = require("../models/Province");
const District = require("../models/District");

exports.provinces_get_all = (req, res, next) => {
    Province.find()
      .sort({ name: 'asc' })
      .select("code name name_with_type")
      .exec()
      .then((docs) => {
        const response = {
          success: true,
          data: {
            count: docs.length,
            provinces: docs.map((doc) => {
              return {
                _id: doc._id,
                code: doc.code,
                name: doc.name,
                // request: {
                //   type: "GET",
                //   url: "http://localhost:3000/provinces/" + doc.code,
                // },
              };
            }),
          },
        };
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          error: err,
        });
      });
  };