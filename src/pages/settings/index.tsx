import React from "react";
import { Container } from "../../atoms/Container";
import { MenuOption, MenuSection } from "../../atoms/Menu";

const SettingsPage = () => {
  console.log("settings");

  return (
    <Container>
      <h1>Settings</h1>
      <MenuSection>
        <MenuOption title="ciao" />
        <MenuOption title="ciao" />
        <MenuOption title="ciao" />
      </MenuSection>
    </Container>
  );
};

export default SettingsPage;

const menuOptions = [{}];
