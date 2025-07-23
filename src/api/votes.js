import axiosClient from './axiosClient'

export const voteOnPost = async (postId, voteType) => {
    const response = await axiosClient.post('/votes', {
        target_id: postId,
        target_type: 'post',
        vote_type: voteType
    })
    return response.data
}

export const voteOnComment = async (commentId, voteType) => {
    const response = await axiosClient.post('/votes', {
        target_id: commentId,
        target_type: 'comment',
        vote_type: voteType
    })
    return response.data
}

export const removeVote = async (targetId, targetType = 'post') => {
    const response = await axiosClient.delete('/votes', {
        data: {
            target_id: targetId,
            target_type: targetType
        }
    })
    return response.data
}

export const getVotes = async (postId) => {
    const response = await axiosClient.get(`/votes/${postId}`)
    return response.data.result
}

export default {
    voteOnPost,
    voteOnComment,
    removeVote,
    getVotes
}
