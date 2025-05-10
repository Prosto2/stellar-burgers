import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredientByID, ingredientID } from '../../slices/burgerSlice';
import { TIngredient } from '@utils-types';
import { fetchUser } from '../../slices/userSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
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
