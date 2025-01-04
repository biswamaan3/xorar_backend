import AllProject from '@/component/dashboard/project/AllProject'
import { PageHeader } from '@/component/text'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
        <PageHeader title={"All Products"}
        description={<Button as={Link} href='/dashboard/products/add_new' color='primary' >Add New Product</Button>}
        />
        <AllProject/>
    </div>
  )
}

export default page