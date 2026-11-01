import { Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router';

// Mockup: no credentials are checked yet; Supabase Auth replaces this later.
export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Center mih="100vh" p="md">
      <Paper withBorder shadow="sm" p="xl" radius="md" w="100%" maw={400}>
        <Stack>
          <Title order={2} ta="center">
            Sound Leaves
          </Title>
          <TextInput label="E-Mail" placeholder="name@beispiel.de" />
          <PasswordInput label="Passwort" />
          <Button fullWidth onClick={() => navigate('/')}>
            Anmelden
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
