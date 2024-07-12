/* eslint-disable no-param-reassign */
import React from 'react'

// Separators
const regexExp = /[,:;\-_)(\s]/ // \ before - because otherwise it will escape

function useSearchData() {
  const tokenize = React.useCallback((line) => {
    const separatedArr = line?.split(regexExp)
    const tokens = []
    separatedArr?.forEach((token) => {
      token = token.toLowerCase().trim()
      if (token.length !== 0) {
        tokens.push(token)
      }
    })
    return tokens
  }, [])

  const performIndexing = React.useCallback(
    (data) => {
      const indices = {}
      data.forEach((line, index) => {
        const tokens = tokenize(line)
        tokens?.forEach((token) => {
          let array = indices[token]
          if (!array) {
            array = []
            indices[token] = array
          }
          array.push(index)
        })
      })
      return indices
    },
    [tokenize]
  )

  const findTokenIndices = React.useCallback((token, indices) => {
    if (token && indices) {
      return indices[token]
    }
    return null
  }, [])

  const search = React.useCallback(
    (line, indices, data) => {
      const tokens = tokenize(line)
      if (!tokens) return {}

      const tokensIndices = tokens
        .map((token) => {
          const filtered = findTokenIndices(token, indices)
          if (filtered?.length) {
            return filtered
          }
          return null
        })
        .filter((item) => !!item)

      if (!tokensIndices?.length) return { tokens }

      // Ensure all the tokens are found in the result
      const selectedIndices = tokensIndices.reduce((accumulator, current) => {
        // not yet initialized?
        if (!accumulator) return [...current]
        // initialized but empty
        if (!accumulator.length) return []
        // Return intersection to 2 arrays
        const setA = new Set(accumulator)
        const setB = new Set(current)
        const result = []
        // eslint-disable-next-line no-restricted-syntax
        for (const idx of setB) {
          if (setA.has(idx)) {
            result.push(idx)
          }
        }
        return result
      }, null)

      if (!selectedIndices?.length) return { tokens }

      // Return the data corresponding to the selected indices
      const result = selectedIndices.map((idx) => data[idx]).filter((item) => !!item)
      return { tokens, result }
    },
    [findTokenIndices, tokenize]
  )

  return { indexing: performIndexing, search }
}

export { useSearchData }
