import React from 'react';
import { useSelector } from 'react-redux';
import RecipeCL from '../components/MyRecords/Recipes/RecipeCL';
import RecipeAR from '../components/MyRecords/Recipes/RecipeAR';

const RecipeView = ({ att, doc }) => {
    const user = useSelector(state => state.user)
    const data = { att, doc }

    const router = () => {
        switch (user.country ? user.country.toUpperCase() : '') {
            case 'AR':
                return <RecipeAR {...data} />
            case 'CL':
                return <RecipeCL {...data} />
            default:
                return <RecipeAR {...data} />
        }
    }

    return (<> {router()} </>)
}

export default RecipeView
