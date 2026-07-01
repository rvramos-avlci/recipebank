import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Card, Button, Input, Textarea, FormGroup, Select, Table, Alert, fmt } from '@/Components/shared/UI'

function LineIngredient({ ingredient, index, onChange, onRemove, errors }) {
    function update(field, value) {
        const updated = { ...ingredient, [field]: value }
        onChange(index, updated)
    }
   const err = field => errors?.[`ingredients.${index}.${field}`]
    return (
        <div className="grid gap-2 ingredients-center" style={{ gridTemplateColumns: '1fr 90px 90px 60px' }}>
            <div><Input value={ingredient.description} onChange={e => update('description', e.target.value)} placeholder="Description" />
            {err("description") && <p className="mt-2 text-xs text-red-500">{err("description")}</p>}
            </div>
            <Input type="number" min="0.01" step="0.01" value={ingredient.quantity}      onChange={e => update('quantity',      parseFloat(e.target.value)||0)} />
            <div><Input value={ingredient.uom} onChange={e => update('uom', e.target.value)} placeholder="UOM" />
            {err("uom") && <p className="mt-2 text-xs text-red-500">{err("uom")}</p>}
            </div>
            <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600 text-lg leading-none transition-colors">×</button>
        </div>
    )
}

function LineMethod({ method, index, onChange, onRemove, errors }) {
    function update(field, value) {
        const updated = { ...method, [field]: value }
        onChange(index, updated)
    }
   const err = field => errors?.[`methods.${index}.${field}`]
    return (
        <div className="grid gap-2 methods-center" style={{ gridTemplateColumns: '60px 1fr 90px' }}>
            <Input type="number" min="1" step="1" value={method.sequence}      onChange={e => update('sequence',      parseFloat(e.target.value)||0)} />
            <div><Input value={method.method} onChange={e => update('method', e.target.value)} placeholder="Method" />
            {err("method") && <p className="mt-2 text-xs text-red-500">{err("method")}</p>}
            </div>            
            <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600 text-lg leading-none transition-colors">×</button>
        </div>
    )
}

export default function RecipeForm({ recipe={}, submitUrl, method = 'post' }) {    
    const isEdit = !!recipe?.id;
    const { data, setData, post, put, processing, errors } = useForm({
        code: '',
        description: '',
        is_active: true,
        ingredients: [],        
        methods: [],          
    })
    useEffect(() => {
        if (!open) return
            setData({
                code: recipe.code ?? '',
                description: recipe.description ?? '',
                is_active: recipe.is_active ?? true,
                ingredients:        (recipe?.ingredients ?? []).map(i => ({
                    description:    i.description,
                    quantity:       parseFloat(i.quantity),
                    uom:            i.uom,
                })),        
                methods:            (recipe?.methods ?? []).map(m => ({
                    sequence:       parseFloat(m.sequence),
                    method:         m.method,
                })), 
        })    
    },[open])
 
    function updateIngredient(index, updated) {
        const ingredients = [...data.ingredients]
        ingredients[index] = updated
        setData('ingredients', ingredients)
    }

    function updateMethod(index, updated) {
        const methods = [...data.methods]
        methods[index] = updated
        setData('methods', methods)
    }
        
    function addIngredient() {
        setData('ingredients', [...data.ingredients, {description: '', quantity: 1, uom: 'Gm'}])
    }

    function addMethod() {
        setData('methods', [...data.methods, {sequence: 1, method: ''}])
    }

    function removeIngredient(index) {
        setData('ingredients', data.ingredients.filter((_, i) => i !== index))
    }
    function removeMethod(index) {
        setData('methods', data.methods.filter((_, i) => i !== index))
    }    
    function submit(e) {
        e.preventDefault()
        const payload = { ...data, ingredients: data.ingredients, methods: data.methods }

        if (isEdit) {
            put(submitUrl, payload)
        } else {
            post(submitUrl, payload)
        }
    }    
    return ( 
            <form onSubmit={submit} className="space-y-6">
                {/* Recipe details */}
                <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-2 gap-4">
                        <FormGroup label="Code *" error={errors.code}>
                            <Input label="Code" value={data.code} onChange={e => setData('code',e.target.value)} required />
                        </FormGroup>
                        <div />
                        <FormGroup label="Description *" error={errors.description}>
                            <Input label="Description" value={data.description} onChange={e => setData('description',e.target.value)} required/>
                        </FormGroup>
                        <FormGroup label="Status *" error={errors.status}>  
                            <Select label="Status" value={data.isActive ? '1' : '0'} onChange={e => setData('isActive',e.target.value === '1')}>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Select>
                        </FormGroup>
                    </div>                        
                </Card>

                {/* Ingredients */}
                <Card>
                        <div className="flex ingredients-center justify-between mb-4" >
                            <h3 className="font-serif text-base mb-3">Ingredients</h3>
                            <Button size="sm" onClick={addIngredient}>+ Add Ingredient</Button>
                        </div>
                        {data.ingredients.length === 0 ? (
                            <div className="text-center py-8 text-[var(--text-muted)] text-sm">No Ingredient yet. Add a Ingredient</div>
                        ) : (
                            <>
                                <div className="grid gap-2 mb-2 text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
                                    style={{ gridTemplateColumns: '1fr 90px 90px 60px' }}>
                                    <span>Description</span><span>Quantity</span><span>UOM</span>                                
                                </div>
                                {data.ingredients.map((ingredient, i) => (
                                    <LineIngredient key={i} ingredient={ingredient} index={i} onChange={updateIngredient} onRemove={removeIngredient} errors={errors}/>
                                ))}
                            </>
                        )}
                        {errors.ingredients && <p className="mt-2 text-xs text-red-500">{errors.ingredients}</p>}                     
                </Card>
                {/* Methods */}
                <Card>
                        <div className="flex methods-center justify-between mb-4" >
                            <h3 className="font-serif text-base mb-3">methods</h3>
                            <Button size="sm" onClick={addMethod}>+ Add Method</Button>
                        </div>
                        {data.methods.length === 0 ? (
                            <div className="text-center py-8 text-[var(--text-muted)] text-sm">No method yet. Add a method</div>
                        ) : (
                            <>
                                <div className="grid gap-2 mb-2 text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
                                    style={{ gridTemplateColumns: '60px 1fr 90px' }}>
                                    <span>sequence</span><span>Method</span>                               
                                </div>
                                {data.methods.map((method, i) => (
                                    <LineMethod key={i} method={method} index={i} onChange={updateMethod} onRemove={removeMethod} errors={errors}/>
                                ))}
                            </>
                        )}
                        {errors.methods && <p className="mt-2 text-xs text-red-500">{errors.methods}</p>}                        
                </Card>
            <Button variant="primary" className="w-full justify-center" type="submit" loading={processing}>
                    {isEdit ? 'Update Recipe' : 'Create Recipe'}
            </Button>
            </div>
        </form>
    )
}
