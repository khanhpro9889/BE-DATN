const mongoose = require("mongoose");

const District = require("../models/District");
const Province = require("../models/Province");

exports.districts_get_all = (req, res, next) => {
  District.find()
    .select("_id parent_code code name name_with_type")
    .exec()
    .then((docs) => {
      res.status(200).json({
        success: true,
        data: {
          count: docs.length,
          districts: docs.map((doc) => {
            return {
              _id: doc._id,
              parent_code: doc.parent_code,
              code: doc.code,
              name: doc.name,
              request: {
                type: "GET",
                url: "http://localhost:3000/districts/" + doc._id,
              },
            };
          }),
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};

exports.districts_get_by_province = async (req, res, next) => {
  const province = await Province.findById(req.params.code);
  District.find({ parent_code: province.code })
    .select("_id parent_code code name name_with_type")
    .exec()
    .then((district) => {
      if (district.length == 0) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }
      res.status(200).json({
        success: true,
        districts: district,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        error: err,
      });
    });
};