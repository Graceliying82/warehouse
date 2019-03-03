module.exports = {
    //  Get Products
    async function (keyName, db) {
        const counterCollection = db.collection("counter");
        let sequenceDocument = await counterCollection.findAndModify({
            query:{_id: keyName },
            update: {$inc:{sequence_value:1}},
            new:true
        });
        return sequenceDocument.sequence_value;
    }
}