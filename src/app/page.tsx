import Image from 'next/image'
import styles from './page.module.css'
import { Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';

export default function Home() {
  return (
      <Box className={styles.main} bg="darkgreen" height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Button colorScheme="teal" size="lg">
          Connect with MetaMask
        </Button>
      </Box>
  )
}
