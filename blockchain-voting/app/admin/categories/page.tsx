"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import { getVotingCategories, addVotingCategory, removeVotingCategory } from "@/lib/blockchain"

interface Category {
  id: string
  name: string
  description: string
  positions: string[]
}

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    positions: "",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getVotingCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const positionsArray = newCategory.positions
        .split(",")
        .map((pos) => pos.trim())
        .filter((pos) => pos.length > 0)

      await addVotingCategory({
        name: newCategory.name,
        description: newCategory.description,
        positions: positionsArray,
      })

      setNewCategory({
        name: "",
        description: "",
        positions: "",
      })

      fetchCategories()
    } catch (error) {
      console.error("Error adding category:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveCategory = async (categoryId: string) => {
    try {
      await removeVotingCategory(categoryId)
      fetchCategories()
    } catch (error) {
      console.error("Error removing category:", error)
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col max-w-4xl mx-auto">
        <div className="w-full mb-8">
          <Link href="/admin" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/unizik-logo.png" alt="UNIZIK Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold">Voting Categories</h1>
          </div>
          <p className="text-muted-foreground">Manage voting categories and positions for ZIKITESVOTE elections</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create a new voting category with positions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Student Union Government"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this voting category"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positions">Positions (comma-separated)</Label>
                <Textarea
                  id="positions"
                  placeholder="e.g., President, Vice President, Secretary, Treasurer"
                  value={newCategory.positions}
                  onChange={(e) => setNewCategory({ ...newCategory, positions: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter position names separated by commas. These will be the positions candidates can run for in this
                  category.
                </p>
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
            <CardDescription>Manage your voting categories</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No voting categories found. Add your first category above.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {category.positions.map((position, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            >
                              {position}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCategory(category.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
