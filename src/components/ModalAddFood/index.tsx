import { Component, createRef, useEffect } from "react";
import { FiCheckSquare } from "react-icons/fi";

import { Form } from "./styles";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { FoodInterface } from "../../types";

interface ModalAddFoodProps {
  isOpen: boolean;
  foods: FoodInterface[];
  setIsOpen: () => void;
  handleAddFood: (Food: FoodInterface) => void;
}

export const ModalAddFood = (props: ModalAddFoodProps): JSX.Element => {
  const formRef = createRef();
  const { isOpen, setIsOpen } = props;

  const handleSubmit = async (data: FoodInterface) => {
    const { setIsOpen, handleAddFood } = props;

    handleAddFood(data);
    setIsOpen();
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};
