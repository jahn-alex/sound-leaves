import { AppShell, Burger, Button, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { navigationItems } from './navigation';

export default function AppLayout() {
  const [isNavbarOpen, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !isNavbarOpen } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={isNavbarOpen} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
            <Title order={3}>Sound Leaves</Title>
          </Group>
          <Button variant="subtle" onClick={() => navigate('/login')}>
            Abmelden
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            component={Link}
            to={item.path}
            label={item.label}
            active={location.pathname === item.path}
            onClick={closeNavbar}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
