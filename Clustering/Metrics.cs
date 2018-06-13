using System;
using System.Numerics;

namespace DiagramVisualization.Clustering
{
    public class Metrics
    {
        public static double EuclideanDistance(Vector<double> a, Vector<double> b, int n)
        {
            double sum = 0;
            for (int i = 0; i < n; i++)
                sum += Math.Pow(a[i] - b[i], 2);
            return Math.Sqrt(sum);
        }
    }
}
