import express from "express";

export function createResourceRouter(Model, searchableFields = []) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.search && searchableFields.length) {
        filter.$or = searchableFields.map(field => ({
          [field]: { $regex: req.query.search, $options: "i" }
        }));
      }
      const records = await Model.find(filter).sort({ createdAt: -1 }).limit(200);
      res.json(records);
    } catch (error) { next(error); }
  });

  router.post("/", async (req, res, next) => {
    try {
      const record = await Model.create(req.body);
      res.status(201).json(record);
    } catch (error) { next(error); }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const record = await Model.findById(req.params.id);
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json(record);
    } catch (error) { next(error); }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const record = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
      });
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json(record);
    } catch (error) { next(error); }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const record = await Model.findByIdAndDelete(req.params.id);
      if (!record) return res.status(404).json({ message: "Record not found." });
      res.json({ message: "Record deleted successfully." });
    } catch (error) { next(error); }
  });

  return router;
}
