import {
  AppShell,
  Navbar,
  MediaQuery,
  Header,
  Text,
  Anchor,
  Group,
  Title,
  Burger,
  useMantineTheme,
  ThemeIcon,
  createStyles,
} from "@mantine/core";
import { HomeIcon, ListBulletIcon } from "@modulz/radix-icons";
import * as React from "react";
import { useState } from "react";
import { Link, NavLink as BaseNavLink } from "react-router-dom";

interface NavLinkProps {
  exactPath?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  to: string;
}

const useStyles = createStyles((theme) => ({
  navLink: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    textDecoration: "none",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  navLinkActive: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
  },
}));

const NavLink = ({ exactPath, icon, label, onClick, to }: NavLinkProps) => {
  const { classes } = useStyles();

  return (
    <BaseNavLink
      className={({ isActive }) =>
        classes.navLink + (isActive ? ` ${classes.navLinkActive}` : "")
      }
      end={exactPath}
      onClick={onClick}
      to={to}
    >
      <Group>
        <ThemeIcon variant="light">{icon}</ThemeIcon>
        <Text component="span" size="md">
          {label}
        </Text>
      </Group>
    </BaseNavLink>
  );
};

interface Props {
  children?: React.ReactNode;
}

const CustomAppShell = ({ children }: Props) => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const closeMenu = React.useCallback(() => setOpened(false), [setOpened]);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200 }}
        >
          <NavLink
            exactPath
            icon={<HomeIcon />}
            label="Home"
            onClick={closeMenu}
            to="/"
          />
          <NavLink
            icon={<ListBulletIcon />}
            label="Accounts"
            onClick={closeMenu}
            to="/accounts"
          />
        </Navbar>
      }
      header={
        <Header
          height={60}
          styles={{
            root: { background: theme.colors[theme.primaryColor][5] },
          }}
        >
          <Group style={{ height: "100%", justifyItems: "center" }}>
            <Anchor
              color="dark"
              component={Link}
              style={{ flexGrow: 1 }}
              to="/"
            >
              <Title order={3} ml="lg">
                Zeroed Books
              </Title>
            </Anchor>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default CustomAppShell;
