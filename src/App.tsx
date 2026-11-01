import { Button, Container, Stack, TextInput, Title } from '@mantine/core';
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <Container size="xs" mt="xl">
      <Stack>
        <Title order={2}>Setup check</Title>
        <TextInput label="Name" placeholder="Type something" />
        <Button onClick={() => setCount((c) => c + 1)}>
          Clicked {count} times
        </Button>
      </Stack>
    </Container>
  );
}