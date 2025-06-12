'use client';

import { TextInput, Button, Title, Text, Container, Stack, Group, Card, Table, Loader, Center, Divider, ActionIcon, Modal } from '@mantine/core';
import { useInputState, useListState, useToggle, useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
};

export default function SubmitPage() {
  const [name, setName] = useInputState('');
  const [email, setEmail] = useInputState('');
  const [nameFilter, setNameFilter] = useInputState('');
  const [emailFilter, setEmailFilter] = useInputState('');
  const [users, usersHandlers] = useListState<User>([]);
  const [loading, toggleLoading] = useToggle();
  const [submitting, toggleSubmitting] = useToggle();
  const [deleting, setDeleting] = useInputState<number | null>(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [userToDelete, setUserToDelete] = useInputState<User | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return;

    toggleSubmitting();
    try {
      const response = await fetch('/submit/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (response.ok) {
        setName('');
        setEmail('');
        // Refresh the user list after successful submission
        await fetchUsers();
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      toggleSubmitting();
    }
  };

  const fetchUsers = async () => {
    toggleLoading();
    try {
      const params = new URLSearchParams();
      if (nameFilter.trim()) params.append('name', nameFilter.trim());
      if (emailFilter.trim()) params.append('email', emailFilter.trim());

      const response = await fetch(`/submit/api${params.toString() ? `?${params.toString()}` : ''}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'ok' && Array.isArray(result.data)) {
          usersHandlers.setState(result.data);
        }
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      toggleLoading();
    }
  };

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(userToDelete.id);
    try {
      const response = await fetch(`/submit/api?id=${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the user from the local state
        usersHandlers.filter((user) => user.id !== userToDelete.id);
        closeDeleteModal();
        setUserToDelete(null);
      } else {
        console.error('Delete failed:', response.statusText);
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const clearFilters = () => {
    setNameFilter('');
    setEmailFilter('');
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [nameFilter, emailFilter]);

  return (
    <Container size="lg" py={60}>
      {/* Submit Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Title 
          order={1} 
          size="3rem"
          fw={300}
          c="gray.1"
          mb="md"
        >
          Database Integration Demo
        </Title>
        <Text 
          size="lg" 
          c="gray.4" 
          maw={600} 
          mx="auto"
          mb="xl"
        >
          Demonstrating full-stack capabilities with user submission and real-time querying.
        </Text>
      </div>

      {/* Submit User Section */}
      <Card
        p="xl"
        radius="md"
        bg="dark.6"
        mb="xl"
        style={{ borderLeft: '4px solid var(--mantine-color-blue-6)' }}
      >
        <Title order={2} size="1.5rem" fw={500} c="gray.1" mb="lg">
          Submit New User
        </Title>
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Enter full name"
              styles={{
                label: { color: 'var(--mantine-color-gray-3)' },
                input: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)',
                  color: 'var(--mantine-color-gray-1)',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-blue-6)',
                  },
                },
              }}
            />
            <TextInput
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="Enter email address"
              type="email"
              styles={{
                label: { color: 'var(--mantine-color-gray-3)' },
                input: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)',
                  color: 'var(--mantine-color-gray-1)',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-blue-6)',
                  },
                },
              }}
            />
          </Group>
          <Group justify="center">
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || !email.trim() || submitting}
              size="md"
              style={{ minWidth: '120px' }}
            >
              {submitting ? <Loader size="sm" /> : 'Submit User'}
            </Button>
          </Group>
        </Stack>
      </Card>

      <Divider mb="xl" color="dark.4" />

      {/* Query Section */}
      <Card
        p="xl"
        radius="md"
        bg="dark.6"
        mb="xl"
        style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}
      >
        <Group justify="space-between" align="center" mb="lg">
          <Title order={2} size="1.5rem" fw={500} c="gray.1">
            Query Users
          </Title>
          <Group gap="sm">
            <Button
              onClick={clearFilters}
              variant="light"
              size="sm"
              disabled={!nameFilter && !emailFilter}
            >
              Clear Filters
            </Button>
            <Button
              onClick={fetchUsers}
              variant="light"
              size="sm"
              leftSection="🔄"
            >
              Refresh
            </Button>
          </Group>
        </Group>

        <Stack gap="md" mb="lg">
          <Group grow>
            <TextInput
              label="Filter by Name"
              value={nameFilter}
              onChange={setNameFilter}
              placeholder="Search by name substring..."
              styles={{
                label: { color: 'var(--mantine-color-gray-3)' },
                input: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)',
                  color: 'var(--mantine-color-gray-1)',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-green-6)',
                  },
                },
              }}
            />
            <TextInput
              label="Filter by Email"
              value={emailFilter}
              onChange={setEmailFilter}
              placeholder="Search by email substring..."
              styles={{
                label: { color: 'var(--mantine-color-gray-3)' },
                input: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)',
                  color: 'var(--mantine-color-gray-1)',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-green-6)',
                  },
                },
              }}
            />
          </Group>
        </Stack>

        {/* Results Table */}
        {loading ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="gray.4">Loading users...</Text>
            </Stack>
          </Center>
        ) : users.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <Table
              striped
              highlightOnHover
              styles={{
                table: { backgroundColor: 'var(--mantine-color-dark-7)' },
                th: { 
                  backgroundColor: 'var(--mantine-color-dark-8)',
                  color: 'var(--mantine-color-gray-3)',
                  borderBottom: '2px solid var(--mantine-color-dark-4)',
                },
                td: { 
                  color: 'var(--mantine-color-gray-1)',
                  borderBottom: '1px solid var(--mantine-color-dark-5)',
                },
                tr: {
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-dark-6)',
                  },
                },
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Created At</Table.Th>
                  <Table.Th style={{ width: '100px' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>{user.id}</Table.Td>
                    <Table.Td>{user.name}</Table.Td>
                    <Table.Td>{user.email}</Table.Td>
                    <Table.Td>
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        disabled={deleting === user.id}
                        loading={deleting === user.id}
                        aria-label={`Delete ${user.name}`}
                      >
                        {deleting === user.id ? <Loader size="xs" /> : '🗑️'}
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Text c="gray.4" size="lg">
                {nameFilter || emailFilter ? 'No users match your search criteria' : 'No users found'}
              </Text>
              <Text c="gray.6" size="sm">
                {nameFilter || emailFilter ? 'Try adjusting your filters' : 'Submit a user above to get started'}
              </Text>
            </Stack>
          </Center>
        )}

        {users.length > 0 && (
          <Text c="gray.6" size="sm" mt="md" ta="center">
            Showing {users.length} user{users.length !== 1 ? 's' : ''}
            {(nameFilter || emailFilter) && ' matching your filters'}
          </Text>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        centered
        styles={{
          content: { backgroundColor: 'var(--mantine-color-dark-6)' },
          header: { backgroundColor: 'var(--mantine-color-dark-6)', borderBottom: '1px solid var(--mantine-color-dark-4)' },
          title: { color: 'var(--mantine-color-gray-1)', fontWeight: 600 },
          close: { color: 'var(--mantine-color-gray-3)' },
          body: { backgroundColor: 'var(--mantine-color-dark-6)' },
        }}
      >
        <Stack gap="md">
          <Text c="gray.3">
            Are you sure you want to delete this user?
          </Text>
          {userToDelete && (
            <Card p="sm" bg="dark.7" style={{ border: '1px solid var(--mantine-color-red-8)' }}>
              <Text size="sm" c="gray.3" mb={4}>
                <strong>Name:</strong> {userToDelete.name}
              </Text>
              <Text size="sm" c="gray.3">
                <strong>Email:</strong> {userToDelete.email}
              </Text>
            </Card>
          )}
          <Text size="sm" c="red.4">
            This action cannot be undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={closeDeleteModal}
              disabled={deleting !== null}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              disabled={deleting !== null}
              loading={deleting !== null}
            >
              Delete User
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Text c="gray.6" size="sm">
          Real-time database operations • Full-stack integration demo
        </Text>
      </div>
    </Container>
  );
}