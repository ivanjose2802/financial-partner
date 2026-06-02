import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { goalsApi, type CreateGoalPayload, type UpdateGoalPayload } from '@/lib/api-client'

function currentMonthString(): string {
  return new Date().toISOString().slice(0, 7)
}

export function useGoals(month?: string) {
  const targetMonth = month ?? currentMonthString()

  return useQuery({
    queryKey: ['goals', targetMonth],
    queryFn: () => goalsApi.list(targetMonth),
    staleTime: 60_000,
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateGoalPayload) => goalsApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateGoalPayload }) =>
      goalsApi.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}
