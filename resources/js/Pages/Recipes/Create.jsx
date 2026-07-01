import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader } from '@/Components/shared/FlashMessages'
import { Button } from '@/Components/shared/UI'
import RecipeForm from '@/Components/recipes/RecipeForm'

export default function CreateRecipe() {
    return (
        <AppLayout title="Create Recipe">
            <Head title="Create Recipe" />
            <FlashMessages />
            <PageHeader title="New Recipe">
                <Link href="/recipes"><Button variant="secondary">Back</Button></Link>
            </PageHeader>
            <RecipeForm submitUrl="/recipes" method="post" />
        </AppLayout>
    )
}
