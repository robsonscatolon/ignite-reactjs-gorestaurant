import { FiEdit3, FiTrash } from "react-icons/fi";

import { Container } from "./styles";
import { FoodInterface } from "../../types";
import api from "../../services/api";
import { useState } from "react";

interface FoodProps {
  key: number;
  food: FoodInterface;
  handleEditFood: (food: FoodInterface) => void;
  handleDeleteFood: (foodId: number) => void;
  handleUpdateFood: (food: FoodInterface) => void;
}

interface State {
  isAvailable: boolean;
}

export const Food = (props: FoodProps): JSX.Element => {
  const { food, handleEditFood, handleDeleteFood, handleUpdateFood } = props;
  const [state, setState] = useState({ isAvailable: props.food.available } as State);

  const toggleAvailable = async (food: FoodInterface) => {
    const { isAvailable } = state;

    const response = await api.put(`/foods/${food.id}`, {
      ...food,
      available: !isAvailable,
    });
    
    setState({ isAvailable: !isAvailable });
    handleUpdateFood(response.data);
  };

  const handleDelete = async (foodId: number) => {
    handleDeleteFood(foodId);
  };

  const setEditingFood = () => {
    handleEditFood(food);
  };

  return (
    <Container available={state.isAvailable}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{state.isAvailable ? "Disponível" : "Indisponível"}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={state.isAvailable}
              onChange={() => toggleAvailable(food)}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
};
