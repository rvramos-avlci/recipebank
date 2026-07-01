import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { FlashMessages, PageHeader } from '@/Components/shared/FlashMessages'
import { Button } from '@/Components/shared/UI'
import RecipeForm from '@/Components/recipes/RecipeForm'

export default function EditRecipe({ recipe }) {
    return (
        <AppLayout title="Edit Recipe">
            <Head title="Edit Recipe" />
            <FlashMessages />
            <PageHeader title={`Edit Recipe: ${recipe.code}`}>
                <Link href="/recipes"><Button variant="secondary">Back</Button></Link>
            </PageHeader>

            <RecipeForm recipe={recipe} submitUrl={`/recipes/${recipe.id}`} method="put" />
        </AppLayout>
    )
}