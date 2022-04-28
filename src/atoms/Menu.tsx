import styled from "styled-components";
import Icon from "./icon";

interface MenuOptionProps {
  title: string;
}

export const MenuOption = ({ title }: MenuOptionProps) => {
  return (
    <MenuOptionContainer>
      <Icon icon="man" />
      {title}
    </MenuOptionContainer>
  );
};

export const MenuOptionContainer = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  gap: 8px;

  svg {
    margin-left: -10px;
  }
`;

export const MenuSection = styled.div`
  display: flex;
  flex-direction: column;

  ${MenuOptionContainer}:first-child {
    border-radius: 8px 8px 0 0;
  }
  ${MenuOptionContainer}:last-child {
    border-radius: 0 0 8px 8px;
    border-bottom: none;
  }
`;
