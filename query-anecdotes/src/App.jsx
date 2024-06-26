import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdoteVotes } from './request'
import { NotificationProvider } from './NotificationContext';

const App = () => {
  const newVotes = useMutation({
    mutationFn: updateAnecdoteVotes,
    onSuccess: (newData) => {
      // 性能优化 NB
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newData))
      queryClient.invalidateQueries('anecdotes')
    },
  })
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: () => getAnecdotes()
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data
  console.log(anecdotes);

  const handleVote = (anecdote) => {
    console.log('vote')
    newVotes.mutate({...anecdote, votes: anecdote.votes + 1})
    useQueryClient
  }

  return (
    <NotificationProvider>
      <div>
        <h3>Anecdote app</h3>
      
        <Notification />
        <AnecdoteForm />
      
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </div>
    </NotificationProvider>
  )
}

export default App
