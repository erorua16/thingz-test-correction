import { Mongo } from 'meteor/mongo';   
import { Meteor } from "meteor/meteor";
import { PromoStudentsCollectionType } from "../types/PromoStudentsCollectionType"

export const PromoStudentsCollection = new Mongo.Collection<PromoStudentsCollectionType>('PromoStudents')

Meteor.methods({
    insertPromo({name, students}){
        const promo = PromoStudentsCollection.insert(
            {
                name: name,
                students: students,
                createdAt: new Date()
            },
            (error: any, result: any) => {
                if (error) return error; //info about what went wrong
                if (result) return result; //the _id of new object if successful
            })
            return promo
    },
})