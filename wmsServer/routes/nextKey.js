module.exports = {
    //  Get Products
    async key (keyName, db) {
        const counterCollection = db.collection("counter");
        let sequenceDocument = await counterCollection.findOneAndUpdate(
            {_id: keyName},
            {$inc:{sequence_value:1}},
            {upsert: true, returnNewDocument: true }
        );
        return sequenceDocument.value.sequence_value;
    }
}