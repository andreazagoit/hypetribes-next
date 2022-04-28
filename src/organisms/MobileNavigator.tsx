import Link from "next/link";
import React from "react";
import styled from "styled-components";

const MobileNavigator = () => {
  return (
    <MobileNavigatorContainer>
      {menuOptions.map((option) => (
        <Link href={option.href}>
          <MobileNavigatorContainerItem key={option.id}>
            {option.name}
          </MobileNavigatorContainerItem>
        </Link>
      ))}
    </MobileNavigatorContainer>
  );
};

export default MobileNavigator;

const menuOptions = [
  { id: "1", name: "H", icon: "home", href: "/" },
  { id: "2", name: "C", icon: "home", href: "/categories" },
  { id: "3", name: "Y", icon: "home", href: "/" },
  { id: "4", name: "S", icon: "Settings", href: "/settings" },
];

export const MobileNavigatorContainer = styled.div`
  background-color: rebeccapurple;
  height: 64px;
  display: flex;
  justify-content: space-evenly;
`;

export const MobileNavigatorContainerItem = styled.a`
  background-color: green;
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
