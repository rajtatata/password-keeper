exports.firestoreWrite = (firestore, collection, id, data) => {
    if (id === null) {
        return firestore.collection(collection).add(data)
    }
    return firestore.collection(collection).doc(id).set(data)
}

exports.firestoreRead = (firestore, collection, id) => {
    return firestore.collection(collection).doc(id).get()
}

exports.firestoreUpdate = (firestore, collection, id, updates) => {
    return firestore.collection(collection).doc(id).update(updates)
}

exports.firestoreDelete = (firestore, collection, id) => {
    return firestore.collection(collection).doc(id).delete()
}