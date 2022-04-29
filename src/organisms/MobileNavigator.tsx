import Link from "next/link";
import React from "react";
import styled from "styled-components";
import Icon from "../atoms/icon";

const MobileNavigator = () => {
  return (
    <MobileNavigatorContainer>
      {menuOptions.map((option) => (
        <Link href={option.href}>
          <MobileNavigatorContainerItem key={option.id}>
            <Icon icon={option.icon} color="white" />
          </MobileNavigatorContainerItem>
        </Link>
      ))}
    </MobileNavigatorContainer>
  );
};

export default MobileNavigator;

const menuOptions = [
  { id: "1", name: "Home", icon: "home", href: "/" },
  { id: "2", name: "Categories", icon: "colours", href: "/categories" },
  { id: "3", name: "Favourites", icon: "heart", href: "/" },
  { id: "4", name: "Settings", icon: "cog", href: "/settings" },
];

export const MobileNavigatorContainer = styled.div`
  background-color: rebeccapurple;
  height: 64px;
  display: flex;
  justify-content: space-evenly;
`;

export const MobileNavigatorContainerItem = styled.a`
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
