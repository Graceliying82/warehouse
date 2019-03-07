module.exports = {
    //  Get Products
    async key (keyName, db) {
        const counterCollection = db.collection("counter");
        let sequenceDocument = await counterCollection.findOneAndUpdate(
            {_id: keyName},
            {$inc:{sequence_value:1}},
            {upsert: true, returnNewDocument: true }
        );
        if (!sequenceDocument.value) {
          return 0;
        }
        return sequenceDocument.value.sequence_value;
    }
}