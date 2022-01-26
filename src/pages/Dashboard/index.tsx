import { Header } from "../../components/Header";
import api from "../../services/api";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { FoodInterface } from "../../types";
import { useEffect, useState } from "react";

interface State {
  foods: FoodInterface[];
  editingFood: FoodInterface;
}

interface ModalState { 
  modalOpen: boolean;
  editModalOpen: boolean;
}
export const Dashboard = (): JSX.Element => {
  const [state, setState] = useState<State>({
    foods: [],
    editingFood: {} as FoodInterface,
  });

  const [modalState, setModalState] = useState<ModalState>({ modalOpen: false, editModalOpen: false })
  
  useEffect(() => {
    api.get("/foods").then((response) => {
      setState({ ...state, foods: response.data });
    });
  }, []);

  const handleAddFood = async (food: FoodInterface) => {
    const { foods } = state;

    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setState({ ...state, foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodInterface) => {
    try {

      const foodUpdated = await api.put(`/foods/${state.editingFood.id}`, {
        ...state.editingFood,
        ...food,
      });
      
      const foodsUpdated = state.foods.map((f) =>
      f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      await setState({ ...state, editingFood: foodUpdated.data, foods: foodsUpdated });
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setState({ ...state, foods: foodsFiltered });
  };

  const toggleModal = () => {
    setModalState({ ...modalState, modalOpen: !modalState.modalOpen });
  };
  
  const toggleEditModal = () => {
    setModalState({ ...modalState, editModalOpen: !modalState.editModalOpen });
  };

  const handleEditFood = (food: FoodInterface) => {
    setState({ ...state, editingFood: food });
    setModalState({ ...modalState, editModalOpen: true });    
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        foods={state.foods}
        isOpen={modalState.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalState.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={state.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {state.foods &&
          state.foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDeleteFood={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleUpdateFood={handleUpdateFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
