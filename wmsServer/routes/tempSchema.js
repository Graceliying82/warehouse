module.exports = {
      // {"schema":[
      //   { "_id": "RamSz",
      //     "value": ["16g","32g"]
      //   },
      //   { "_id": "RamType",
      //     "value": ["ssd"]
      //   }
      //  ]
      // }
  async post (req, res, next) {
    try {
      const schemaCollection = req.db.collection("tempschema");
      for (let aSchema of req.body.schema) {
        // console.log(aSchema._id)
        // console.log(aSchema.value)
        let aResult = await schemaCollection.findOne({_id: aSchema._id})
        if (aResult) {
          for (let aVal of aResult.value) {
            if (aSchema.value.indexOf(aVal) === -1) {
              aSchema.value.unshift(aVal)
            }
          }
        }
        await schemaCollection.findOneAndUpdate(
          {
            _id: aSchema._id
          }, //query
          {
            $set: { value: aSchema.value }
          },
          { upsert: true }
        );
      }
      res.send('OK');
      res.end();
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  async get (req, res, next) {
    const schemaCollection = req.db.collection("tempschema");
    try {
      if ((req.query.id === undefined)) {
        let result = await schemaCollection.find().toArray()
        res.send(result)
        res.end()
      } else {
        let result = await schemaCollection.findOne({_id: req.query.id})
        res.send(result)
        res.end()
      }
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  },
  //   { "_id": "RamSz",
  //     "value": "16g"
  //   },
  async deleteValue (req, res, next) {
    const schemaCollection = req.db.collection("tempschema");
    try {
      if ((req.body._id === undefined) || (req.body.value === undefined)) {
        const error = new Error('Not a valid input for delete！');
        error.status = 400;
        return next(error)
      } else {
        let result = await schemaCollection.findOne({_id: req.body._id})
        if (result) {
          let idx = result.value.indexOf(req.body.value)
          if (idx > -1) {
            result.value.splice(idx, 1)
          }
          await schemaCollection.findOneAndUpdate(
            {
              _id: req.body._id
            }, //query
            {
              $set: { value: result.value }
            }
          );
          res.send('success')
          res.end()
        } else {
          const error = new Error('Schema not found');
          error.status = 400;
          return next(error)
        }
      }
    } catch (error) {
      console.log("receive error: " + error);
      if (error.message === null) {
        error.message = 'Fail to access database! Try again'
      };
      next(error);
    }
  }
}