import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import {
  ingredientID,
  selectIngredientByID
} from '../../services/slices/burgerSlice/burgerSlice';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ingredientID(params.id as string));
  }, [dispatch]);

  const ingredientData: TIngredient | undefined =
    useSelector(selectIngredientByID);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
