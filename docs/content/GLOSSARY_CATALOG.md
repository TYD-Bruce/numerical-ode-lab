# Glossary Catalog

Status: Private-source-reviewed draft; maintainer approval pending.

## Catalog rules

This lists every merged candidate admitted by the bounded review method. It does not claim that every body-level concept in the image-only source was extracted. The catalog is planning input only: no row is runtime data, a production card, an annotation, or a maintainer-approved term.

| ID | Preferred term | Aliases | Domain/module | One-sentence draft meaning | Prerequisites or related terms | Readiness | Sources | Planned production priority |
|---|---|---|---|---|---|---|---|---|
| `a_stability` | A-stability | A-stable | Numerical ODE | A time-stepping method is A-stable when its absolute-stability region contains the full open left half-plane. | — | `DECISION_REQUIRED` | NOTES-2025 outline-008 (pp. 16-18) | Blocked by decision |
| `absolute_error` | absolute error | — | Cross-cutting numerical analysis | The magnitude of the difference between an approximate value and its reference value. | `relative_error`, `model_error`, `discretization_error`, `roundoff_error` | `CORE_PROJECT_DRAFT` | NLA-CH03 3.3 (pp. 28-30) | High after review |
| `absolute_stability` | absolute stability | — | Numerical ODE | Behavior of a time-stepping method on a specified test equation as a function of the scaled step parameter. | `ordinary_differential_equation`, `step_size` | `DECISION_REQUIRED` | NOTES-2025 outline-007 (pp. 15-15) | Blocked by decision |
| `adams_bashforth_method` | Adams-Bashforth method | Adams-Bashforth | Numerical ODE | An explicit linear multistep method that advances the solution using derivative values from previous grid points. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-009 (pp. 19-19) | High after review |
| `adams_moulton_method` | Adams-Moulton method | Adams-Moulton | Numerical ODE | An implicit linear multistep method that includes the new-point derivative in its update. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-011 (pp. 22-24) | High after review |
| `adaptive_approximation` | adaptive approximation | — | Approximation and nonlinear equations | An approximation process that allocates additional resolution where an error indicator shows it is most useful. | — | `FUTURE_CANDIDATE` | CHENEY 6.13 (pp. 424-429) | Future |
| `adaptive_quadrature` | adaptive quadrature | — | Approximation and nonlinear equations | A quadrature process that subdivides or changes its rule in response to an integration error estimate. | — | `FUTURE_CANDIDATE` | CHENEY 7.5 (pp. 471-476) | Future |
| `adi_method` | alternating-direction implicit (ADI) method | ADI, alternating-direction implicit | Numerical PDE | A multidimensional implicit PDE method that alternates the spatial direction treated implicitly. | — | `MODULE_DRAFT` | NOTES-2025 outline-029 (pp. 56-56) | Relevant module launch |
| `amplification_factor` | amplification factor | — | Cross-cutting numerical analysis | The factor by which a numerical update multiplies a mode or perturbation over one step. | — | `CORE_PROJECT_DRAFT` | NLA-CH11 11.1 (pp. 105-105) | High after review |
| `asymptotic_region` | asymptotic region | — | Cross-cutting numerical analysis | A refinement range in which the leading error term dominates and observed rates can meaningfully approximate theoretical order. | `convergence` | `DECISION_REQUIRED` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) | Blocked by decision |
| `b_spline` | B-spline | — | Approximation and nonlinear equations | A locally supported basis function used to build piecewise-polynomial spline spaces. | — | `FUTURE_CANDIDATE` | CHENEY 6.5 (pp. 333-342) | Future |
| `backward_error` | backward error | — | Numerical linear algebra | The smallest or measured perturbation of the input data for which a computed result is exact. | — | `MODULE_DRAFT` | NLA-CH07 7.1 (pp. 63-65) | Relevant module launch |
| `backward_euler_method` | Backward Euler method | backward Euler | Numerical ODE | An implicit first-order one-step method that evaluates the derivative at the new time and state. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-008 (pp. 16-18) | High after review |
| `band_matrix` | band matrix | banded matrix | Numerical linear algebra | A matrix whose nonzero entries are confined to a fixed-width band around the main diagonal. | — | `MODULE_DRAFT` | NLA-CH05 5.1 (pp. 47-47) | Relevant module launch |
| `basic_concepts_and_taylor_theorem` | basic concepts and taylor theorem | — | Cross-cutting numerical analysis | An umbrella source section for limits, asymptotic notation, and Taylor-based approximation; it is not proposed as one standalone Glossary term. | — | `DEFERRED` | CHENEY 1.1 (pp. 1-8) | Deferred |
| `bdf_method` | backward differentiation formula (BDF) | BDF, backward differentiation formula | Numerical ODE | An implicit linear multistep family that approximates the derivative by a backward differentiation formula. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-016 (pp. 35-36) | High after review |
| `best_approximation_chebyshev_theory` | best approximation: Chebyshev theory | — | Approximation and nonlinear equations | Approximation that minimizes the maximum absolute error over a stated domain. | — | `FUTURE_CANDIDATE` | CHENEY 6.9 (pp. 370-384) | Future |
| `best_approximation_least_squares_theory` | best approximation: least-squares theory | — | Approximation and nonlinear equations | Approximation that minimizes a sum or integral of squared residuals. | — | `FUTURE_CANDIDATE` | CHENEY 6.8 (pp. 359-369) | Future |
| `big_o_notation` | big-O notation | big o notation, big-o | Cross-cutting numerical analysis | A relation that bounds one quantity by a constant multiple of another near a stated limit. | — | `CORE_PROJECT_DRAFT` | NLA-CH06 6.3 (pp. 55-55) | High after review |
| `bisection_method` | bisection method | — | Approximation and nonlinear equations | A bracketing root-finding method that repeatedly halves an interval whose endpoints have opposite function signs. | — | `FUTURE_CANDIDATE` | CHENEY 3.1 (pp. 57-63) | Future |
| `boundary_condition` | boundary condition | — | Numerical PDE | A condition imposed on the solution along the boundary of a spatial domain. | — | `MODULE_DRAFT` | NLA-CH02 2.8 (pp. 21-23) | Relevant module launch |
| `boundary_value_problem` | boundary value problem | boundary-value problem | Numerical ODE | A differential-equation problem with conditions prescribed at more than one point or along a domain boundary. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.7 (pp. 531-539) | High after review |
| `central_difference` | central difference | — | Numerical PDE | A difference formula using data on both sides of a point to approximate a derivative. | — | `MODULE_DRAFT` | NOTES-2025 outline-018 (pp. 37-42) | Relevant module launch |
| `characteristic_curve` | characteristic curve | characteristics | Numerical PDE | A curve along which a PDE reduces to an ordinary differential relation. | — | `MODULE_DRAFT` | NOTES-2025 outline-030 (pp. 57-57); CHENEY 9.5 (pp. 598-605) | Relevant module launch |
| `cholesky_factorization` | Cholesky factorization | Cholesky decomposition | Numerical linear algebra | A triangular factorization of a symmetric positive-definite matrix. | — | `MODULE_DRAFT` | NLA-CH17 17.1 (pp. 169-174); CHENEY 4.2 (pp. 126-138) | Relevant module launch |
| `collocation_method` | collocation method | collocation | Numerical ODE | An approximation method that enforces the governing equation at selected points. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.10 (pp. 551-554) | High after review |
| `column_space` | column space | range of a matrix | Numerical linear algebra | The set of all linear combinations of a matrix's columns. | — | `MODULE_DRAFT` | NLA-CH01 1.3 (pp. 3-5) | Relevant module launch |
| `computational_cost` | computational cost | floating-point operation, flop count | Cross-cutting numerical analysis | The resources required by a computation, described with a stated measure such as operations, storage, or runtime. | — | `CORE_PROJECT_DRAFT` | NLA-CH06 6.1 (pp. 53-53) | High after review |
| `condition_number` | condition number | — | Numerical linear algebra | A measure of how strongly relative input perturbations may affect the corresponding output. | `matrix_norm`, `vector_norm` | `MODULE_DRAFT` | NLA-CH10 10.1 (pp. 91-95) | Relevant module launch |
| `conditioning` | conditioning | ill conditioning, ill-conditioned, well-conditioned | Cross-cutting numerical analysis | The sensitivity of a problem output to small changes in its input data. | `condition_number`, `numerical_stability` | `CORE_PROJECT_DRAFT` | NLA-CH07 7.1 (pp. 63-65); CHENEY 2.3 (pp. 48-56) | High after review |
| `continuation_method` | continuation method | — | Approximation and nonlinear equations | A method that follows solutions while a problem parameter changes from an easier problem to the target problem. | — | `FUTURE_CANDIDATE` | CHENEY 3.6 (pp. 108-115) | Future |
| `continued_fractions` | continued fractions | — | Approximation and nonlinear equations | A nested quotient representation that can provide rational approximations to a function or number. | — | `FUTURE_CANDIDATE` | CHENEY 6.11 (pp. 403-408) | Future |
| `convection_diffusion_equation` | convection diffusion equation | convection-diffusion | Numerical PDE | A PDE combining transport by a velocity field with diffusion. | — | `MODULE_DRAFT` | NOTES-2025 outline-042 (pp. 70-70); NLA-CH02 2.3 (pp. 15-15) | Relevant module launch |
| `convergence` | convergence | convergent | Numerical ODE | The property that a sequence of approximations approaches a specified limit under a stated refinement or iteration process. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) | High after review |
| `convexity` | convexity | — | Optimization | A property stating that line segments between points remain in a set, or that a function lies below its chords. | — | `OUT_OF_SCOPE` | NLA-CH08 8.2 (pp. 71-76); CHENEY 10.1 (pp. 636-641) | Out of current product scope |
| `crank_nicolson_method` | Crank-Nicolson method | Crank-Nicolson | Numerical PDE | A second-order implicit time-discretization method obtained by averaging endpoint derivative or spatial-operator contributions. | — | `MODULE_DRAFT` | NOTES-2025 outline-021 (pp. 46-47) | Relevant module launch |
| `deflation` | deflation | — | Numerical linear algebra | A transformation that removes or suppresses already computed spectral information so additional eigenpairs can be found. | — | `MODULE_DRAFT` | NLA-CH20 20.6 (pp. 217-220) | Relevant module launch |
| `determinant` | determinant | — | Numerical linear algebra | A scalar associated with a square matrix that encodes invertibility and oriented volume scaling. | — | `MODULE_DRAFT` | NLA-CH01 1.4 (pp. 6-6) | Relevant module launch |
| `diagonalization` | diagonalization | diagonalizable | Numerical linear algebra | Representation of a linear transformation in a basis of eigenvectors so that its matrix is diagonal. | — | `MODULE_DRAFT` | NOTES-2025 outline-007 (pp. 15-15); NLA-CH19 19.2 (pp. 199-200) | Relevant module launch |
| `difference_equations` | difference equations | — | Cross-cutting numerical analysis | Relations that connect values of a sequence at different indices. | — | `MODULE_DRAFT` | CHENEY 1.3 (pp. 20-27) | Relevant module launch |
| `diffusion` | diffusion | — | Numerical PDE | A process that smooths spatial variation by transporting a quantity from high-concentration regions toward low-concentration regions. | — | `MODULE_DRAFT` | NOTES-2025 outline-042 (pp. 70-70); NLA-CH02 2.1 (pp. 13-13) | Relevant module launch |
| `discretization_error` | discretization error | — | Cross-cutting numerical analysis | The discrepancy introduced when a continuous problem is replaced by a discrete approximation. | `truncation_error`, `global_error` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-001 (pp. 1-2); CHENEY 8.5 (pp. 516-523) | High after review |
| `divided_difference` | divided difference | — | Approximation and nonlinear equations | A recursively defined coefficient used in Newton-form polynomial interpolation. | — | `FUTURE_CANDIDATE` | CHENEY 6.2 (pp. 296-304) | Future |
| `dot_product` | dot product | inner product | Numerical linear algebra | A scalar product of two vectors that measures their Euclidean alignment and induces the Euclidean norm. | — | `MODULE_DRAFT` | NOTES-2025 outline-023 (pp. 50-50); NLA-CH06 6.1 (pp. 53-53) | Relevant module launch |
| `downwind_scheme` | downwind scheme | — | Numerical PDE | A directional discretization that uses information from the downstream side of transport and is generally unsuitable for one-way advection. | — | `MODULE_DRAFT` | NOTES-2025 outline-034 (pp. 60-60) | Relevant module launch |
| `eigenvalue` | eigenvalue | — | Numerical linear algebra | A scalar by which a linear transformation scales a corresponding nonzero eigenvector. | `eigenvector`, `spectral_radius` | `MODULE_DRAFT` | NOTES-2025 outline-007 (pp. 15-15); NLA-CH01 1.7 (pp. 11-12); CHENEY 5.1 (pp. 226-236) | Relevant module launch |
| `eigenvector` | eigenvector | — | Numerical linear algebra | A nonzero vector whose direction is preserved by a linear transformation. | — | `MODULE_DRAFT` | NLA-CH01 1.7 (pp. 11-12) | Relevant module launch |
| `energy_method` | energy method | — | Numerical PDE | An analysis technique that derives stability or error bounds from a discrete analogue of physical or mathematical energy. | — | `MODULE_DRAFT` | NOTES-2025 outline-023 (pp. 50-50) | Relevant module launch |
| `equilibrium` | equilibrium | equilibria | Numerical ODE | A state that remains unchanged under the governing evolution equation. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-043 (pp. 71-72); NLA-CH11 11.1 (pp. 105-105) | High after review |
| `euclidean_norm` | euclidean norm | 2-norm | Numerical linear algebra | The square root of the sum of squared vector components. | — | `MODULE_DRAFT` | NOTES-2025 outline-021 (pp. 46-47); NLA-CH07 7.1 (pp. 63-65) | Relevant module launch |
| `euler_maclaurin_formula` | Euler-Maclaurin formula | Euler-Maclaurin | Approximation and nonlinear equations | A formula connecting sums and integrals through endpoint derivatives and Bernoulli-number corrections. | — | `FUTURE_CANDIDATE` | CHENEY 7.7 (pp. 481-485) | Future |
| `exact_solution` | exact solution | — | Numerical ODE | A function that satisfies the stated mathematical problem exactly within the adopted model. | `numerical_approximation`, `global_error` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH07 7.1 (pp. 63-65) | High after review |
| `existence_and_uniqueness_of_solutions` | existence and uniqueness of solutions | — | Numerical ODE | Conditions ensuring that a stated differential problem has a solution and that the solution is the only one in the relevant class. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.1 (pp. 486-490) | High after review |
| `explicit_scheme` | explicit scheme | explicit method | Cross-cutting numerical analysis | A discrete method whose new state is computed directly from already known data. | `implicit_scheme` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-008 (pp. 16-18); CHENEY 9.1 (pp. 572-579) | High after review |
| `fast_fourier_transform` | fast Fourier transform (FFT) | FFT | Cross-cutting numerical analysis | An algorithm that computes a discrete Fourier transform with substantially fewer operations than direct evaluation. | — | `MODULE_DRAFT` | NOTES-2025 outline-026 (pp. 52-53); CHENEY 6.12 (pp. 409-423) | Relevant module launch |
| `final_time_error` | final-time error | — | Numerical ODE | The absolute difference between the numerical and exact values at the final grid point. | `global_error` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523) | High after review |
| `finite_difference` | finite difference | finite-difference | Numerical PDE | A difference quotient or discrete operator used to approximate a derivative. | `central_difference`, `finite_difference_scheme` | `MODULE_DRAFT` | NOTES-2025 outline-001 (pp. 1-2); CHENEY 8.9 (pp. 547-550) | Relevant module launch |
| `finite_difference_scheme` | finite difference scheme | difference scheme, finite-difference scheme | Numerical PDE | A discrete equation formed by replacing derivatives with finite-difference operators on a grid. | — | `MODULE_DRAFT` | NOTES-2025 outline-018 (pp. 37-42) | Relevant module launch |
| `fixed_point_iteration` | fixed point iteration | fixed-point iteration, functional iteration | Approximation and nonlinear equations | An iteration that repeatedly applies a map in order to approach a point left unchanged by that map. | — | `FUTURE_CANDIDATE` | CHENEY 3.4 (pp. 80-87) | Future |
| `floating_point_number` | floating point number | floating-point number | Cross-cutting numerical analysis | A finite-precision representation consisting of a sign, significand, exponent, and format-dependent exceptional values. | — | `CORE_PROJECT_DRAFT` | CHENEY 2.1 (pp. 28-40) | High after review |
| `forward_error` | forward error | — | Numerical linear algebra | The difference between a computed result and the exact result for the original input data. | `backward_error`, `conditioning` | `MODULE_DRAFT` | NLA-CH07 7.1 (pp. 63-65); CHENEY 2.3 (pp. 48-56) | Relevant module launch |
| `forward_euler_method` | Forward Euler method | Euler method, forward Euler | Numerical ODE | An explicit first-order one-step method that advances using the derivative at the current time and state. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-006 (pp. 10-14) | High after review |
| `fourier_analysis` | fourier analysis | — | Numerical PDE | Representation or analysis of a function or grid mode through sinusoidal or complex-exponential components. | — | `MODULE_DRAFT` | NOTES-2025 outline-019 (pp. 43-43) | Relevant module launch |
| `frobenius_norm` | frobenius norm | — | Numerical linear algebra | The square root of the sum of the squared magnitudes of all matrix entries. | — | `MODULE_DRAFT` | NLA-CH09 9.4 (pp. 88-90) | Relevant module launch |
| `gauss_seidel_iteration` | Gauss-Seidel iteration | GaussSeidel iteration | Numerical linear algebra | A stationary linear-system iteration that immediately reuses each newly updated component. | — | `MODULE_DRAFT` | NLA-CH25 25.1 (pp. 271-276) | Relevant module launch |
| `gaussian_elimination` | Gaussian elimination | Gaussian algorithm | Numerical linear algebra | A direct procedure that uses row operations to reduce a linear system to triangular form. | — | `MODULE_DRAFT` | NOTES-2025 outline-022 (pp. 48-49); NLA-CH03 3.1 (pp. 25-26); CHENEY 4.8 (pp. 219-225) | Relevant module launch |
| `gaussian_quadrature` | Gaussian quadrature | — | Approximation and nonlinear equations | A weighted-node integration rule whose nodes and weights are chosen for high polynomial exactness. | — | `FUTURE_CANDIDATE` | CHENEY 7.3 (pp. 456-464) | Future |
| `global_error` | global error | — | Numerical ODE | The difference between the numerical approximation and exact solution after accumulated numerical steps, with the aggregation and sign stated. | `exact_solution`, `numerical_approximation`, `step_size`, `nodal_error`, `final_time_error`, `maximum_global_error` | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523) | Blocked by decision |
| `gram_schmidt` | Gram-Schmidt procedure | GramSchmidt, Gram-Schmidt | Numerical linear algebra | A procedure that converts linearly independent vectors into an orthogonal or orthonormal set spanning the same subspace. | — | `MODULE_DRAFT` | NLA-CH16 16.4 (pp. 162-165) | Relevant module launch |
| `grid_point` | grid point | mesh point | Cross-cutting numerical analysis | One indexed location in a discrete time or spatial grid. | — | `CORE_PROJECT_DRAFT` | NLA-CH02 2.5 (pp. 16-17) | High after review |
| `grid_spacing` | grid spacing | mesh width | Numerical PDE | The distance between neighboring points in a spatial mesh along a stated coordinate direction. | — | `MODULE_DRAFT` | NLA-CH27 27.4 (pp. 300-305) | Relevant module launch |
| `heat_equation` | heat equation | — | Numerical PDE | A parabolic partial differential equation modeling diffusion of a quantity such as temperature. | — | `MODULE_DRAFT` | NOTES-2025 outline-017 (pp. 37-37) | Relevant module launch |
| `hermite_interpolation` | Hermite interpolation | — | Approximation and nonlinear equations | Interpolation that matches function values and one or more derivatives at selected nodes. | — | `FUTURE_CANDIDATE` | CHENEY 6.3 (pp. 305-314) | Future |
| `hessenberg_matrix` | hessenberg matrix | Hessenberg | Numerical linear algebra | A matrix with zeros below the first subdiagonal, or the transposed lower-Hessenberg analogue when stated. | — | `MODULE_DRAFT` | NLA-CH22 22.4 (pp. 236-237) | Relevant module launch |
| `higher_order_ode` | higher order ode | higher-order ordinary differential equation | Numerical ODE | An ordinary differential equation involving derivatives beyond the first derivative. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.6 (pp. 524-530) | High after review |
| `homotopy_method` | homotopy method | homotopy | Approximation and nonlinear equations | A method that continuously deforms an easier problem into a target problem while tracking a solution path. | — | `FUTURE_CANDIDATE` | CHENEY 3.6 (pp. 108-115) | Future |
| `householder_reflector` | Householder reflector | — | Numerical linear algebra | An orthogonal transformation that reflects vectors across a hyperplane and can introduce structured zeros. | — | `MODULE_DRAFT` | NLA-CH15 15.3 (pp. 144-147) | Relevant module launch |
| `hyperbolic_pde` | hyperbolic pde | — | Numerical PDE | A PDE class characterized by wave-like propagation and real characteristic directions under suitable conditions. | — | `MODULE_DRAFT` | NOTES-2025 outline-030 (pp. 57-57) | Relevant module launch |
| `implicit_scheme` | implicit scheme | implicit method | Numerical PDE | A discrete method whose new state is defined by an equation that must be solved. | `explicit_scheme` | `MODULE_DRAFT` | NOTES-2025 outline-008 (pp. 16-18); CHENEY 9.2 (pp. 580-585) | Relevant module launch |
| `induced_matrix_norm` | induced matrix norm | — | Numerical linear algebra | A matrix norm defined as the maximum vector amplification measured by a chosen vector norm. | — | `MODULE_DRAFT` | NLA-CH09 9.1 (pp. 81-81) | Relevant module launch |
| `infinity_norm` | infinity norm | — | Numerical linear algebra | The maximum absolute component of a vector, or the corresponding induced maximum-row-sum norm for a matrix when stated. | `vector_norm`, `matrix_norm` | `MODULE_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH07 7.1 (pp. 63-65) | Relevant module launch |
| `initial_condition` | initial condition | — | Numerical ODE | A value or state prescribed at the initial point of an evolution problem. | `initial_value_problem` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH18 18.1 (pp. 187-189) | High after review |
| `initial_value_problem` | initial value problem (IVP) | IVP, initial value problem, initial-value problem | Numerical ODE | A differential equation together with state data prescribed at an initial point. | `ordinary_differential_equation`, `initial_condition` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH18 18.1 (pp. 187-189) | High after review |
| `interpolation_in_higher_dimensions` | interpolation in higher dimensions | — | Approximation and nonlinear equations | Construction of an approximating function that matches data at nodes in a multidimensional domain. | — | `FUTURE_CANDIDATE` | CHENEY 6.10 (pp. 385-402) | Future |
| `inverse_iteration` | inverse iteration | — | Numerical linear algebra | An eigenvector iteration that repeatedly solves a shifted linear system to target an eigenvalue near the shift. | — | `MODULE_DRAFT` | NLA-CH20 20.5 (pp. 215-216) | Relevant module launch |
| `invertible_matrix` | invertible matrix | invertible, nonsingular matrix | Numerical linear algebra | A square matrix with a two-sided inverse, equivalently a unique solution for every compatible right-hand side. | — | `MODULE_DRAFT` | NLA-CH01 1.4 (pp. 6-6) | Relevant module launch |
| `iteration_count` | iteration count | — | Cross-cutting numerical analysis | The number of repeated algorithm updates performed before stopping. | `stopping_criterion` | `CORE_PROJECT_DRAFT` | NLA-CH20 20.4 (pp. 213-214) | High after review |
| `jacobi_iteration` | jacobi iteration | — | Numerical linear algebra | A stationary linear-system iteration that computes every new component from values in the previous iterate. | — | `MODULE_DRAFT` | NLA-CH25 25.1 (pp. 271-276) | Relevant module launch |
| `lagrange_interpolation` | Lagrange interpolation | — | Approximation and nonlinear equations | Polynomial interpolation expressed as a weighted sum of cardinal basis polynomials. | — | `FUTURE_CANDIDATE` | NLA-CH12 12.1 (pp. 111-112) | Future |
| `laplace_equation` | Laplace equation | — | Numerical PDE | The zero-source special case of the Poisson equation. | `poisson_equation` | `MODULE_DRAFT` | NLA-CH02 2.8 (pp. 21-23); CHENEY 9.9 (pp. 631-635) | Relevant module launch |
| `lax_equivalence_theorem` | Lax equivalence theorem | — | Numerical PDE | For a properly posed linear initial-value problem, a consistent finite-difference scheme converges exactly when it is stable. | — | `MODULE_DRAFT` | NOTES-2025 outline-046 (pp. 78-78) | Relevant module launch |
| `lax_friedrichs_scheme` | Lax-Friedrichs scheme | Lax-Friedrichs | Numerical PDE | An explicit advection scheme that combines centered transport with numerical averaging. | — | `MODULE_DRAFT` | NOTES-2025 outline-039 (pp. 66-66) | Relevant module launch |
| `lax_wendroff_scheme` | Lax-Wendroff scheme | Lax-Wendroff | Numerical PDE | A second-order explicit scheme that uses time-derivative substitution to add a correction to centered transport. | — | `MODULE_DRAFT` | NOTES-2025 outline-041 (pp. 67-69) | Relevant module launch |
| `leapfrog_method` | leapfrog method | leap-frog, leapfrog | Numerical ODE | A two-step centered method that advances using values separated by two time levels. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-013 (pp. 26-26) | High after review |
| `least_squares_problem` | least-squares problem | — | Numerical linear algebra | An optimization problem that chooses parameters minimizing a stated norm of the residual. | — | `MODULE_DRAFT` | NLA-CH14 14.5 (pp. 137-140); CHENEY 5.3 (pp. 245-257) | Relevant module launch |
| `linear_differential_equations` | linear differential equations | — | Numerical ODE | Differential equations in which the unknown function and its derivatives appear linearly. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.11 (pp. 555-565) | High after review |
| `linear_inequalities` | linear inequalities | — | Optimization | Constraints in which linear expressions are bounded above, below, or by equality limits. | — | `OUT_OF_SCOPE` | CHENEY 10.2 (pp. 642-646) | Out of current product scope |
| `linear_programming` | linear programming | — | Optimization | Optimization of a linear objective subject to linear equality and inequality constraints. | — | `OUT_OF_SCOPE` | CHENEY 10.3 (pp. 647-651) | Out of current product scope |
| `linear_system` | linear system | system of linear equations | Numerical linear algebra | A collection of linear equations represented compactly as a matrix equation. | — | `MODULE_DRAFT` | NOTES-2025 outline-007 (pp. 15-15); NLA-CH01 1.3 (pp. 3-5) | Relevant module launch |
| `little_o_notation` | little-o notation | little o notation, little-o | Cross-cutting numerical analysis | A relation stating that one quantity becomes negligible relative to another near a stated limit. | — | `CORE_PROJECT_DRAFT` | NLA-CH06 6.3 (pp. 55-55) | High after review |
| `local_truncation_error` | local truncation error | local error | Numerical ODE | The one-step defect obtained by inserting exact data into a discrete method, with any step normalization stated explicitly. | — | `DECISION_REQUIRED` | NOTES-2025 outline-004 (pp. 3-8) | Blocked by decision |
| `loss_of_significance` | loss of significance | cancellation error | Cross-cutting numerical analysis | A reduction in relative accuracy caused when nearby quantities are subtracted or information is otherwise canceled. | — | `CORE_PROJECT_DRAFT` | CHENEY 2.2 (pp. 41-47) | High after review |
| `low_rank_approximation` | low-rank approximation | dimension reduction | Approximation and nonlinear equations | Approximation of a matrix by another matrix of smaller rank, often chosen to minimize a stated norm of the error. | — | `FUTURE_CANDIDATE` | NLA-CH24 24.5 (pp. 256-258) | Future |
| `lu_factorization` | LU factorization | LU decomposition | Numerical linear algebra | A representation of a matrix as lower- and upper-triangular factors under stated existence conditions. | `gaussian_elimination`, `plu_factorization`, `pivot` | `MODULE_DRAFT` | NLA-CH04 4.1 (pp. 35-38) | Relevant module launch |
| `machine_epsilon` | machine epsilon | unit roundoff | Cross-cutting numerical analysis | A format-dependent spacing or rounding scale near one; the exact convention must state whether it means spacing or unit roundoff. | — | `CORE_PROJECT_DRAFT` | NLA-CH03 3.3 (pp. 28-30) | High after review |
| `matrix` | matrix | — | Numerical linear algebra | A rectangular array of scalars used to represent a linear map or system of linear relations. | — | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH01 1.1 (pp. 1-1); CHENEY 4.1 (pp. 117-125) | Blocked by decision |
| `matrix_matrix_multiplication` | matrix-matrix multiplication | — | Numerical linear algebra | Composition of linear maps represented by row-by-column products of compatible matrices. | — | `MODULE_DRAFT` | NLA-CH01 1.2 (pp. 2-2) | Relevant module launch |
| `matrix_norm` | matrix norm | — | Numerical linear algebra | A function that measures matrix size under stated norm axioms and, when relevant, compatibility conditions. | — | `MODULE_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH09 9.1 (pp. 81-81) | Relevant module launch |
| `matrix_vector_multiplication` | matrix-vector multiplication | — | Numerical linear algebra | Application of a matrix-represented linear map to a vector. | — | `MODULE_DRAFT` | NLA-CH01 1.1 (pp. 1-1) | Relevant module launch |
| `maximum_global_error` | maximum global error | — | Numerical ODE | The largest absolute nodal error over all returned grid points. | `global_error` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523) | High after review |
| `model_error` | model error | — | Cross-cutting numerical analysis | The discrepancy attributable to assumptions or simplifications in the mathematical model rather than the numerical method. | `absolute_error` | `FUTURE_CANDIDATE` | NLA-CH03 3.3 (pp. 28-30) | Future |
| `multigrid_method` | multigrid method | multigrid | Numerical PDE | A solver strategy that combines relaxation and coarse-grid correction across multiple spatial resolutions. | `finite_difference_scheme`, `gauss_seidel_iteration` | `MODULE_DRAFT` | NOTES-2025 outline-026 (pp. 52-53); NLA-CH26 26.1 (pp. 281-284); CHENEY 9.8 (pp. 622-630) | Relevant module launch |
| `multistep_method` | multistep method | multi-step method | Numerical ODE | An ODE method that advances using information from more than one previous time level. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-009 (pp. 19-19); CHENEY 8.4 (pp. 508-515) | High after review |
| `neumann_series_and_iterative_refinement` | neumann series and iterative refinement | — | Numerical linear algebra | A source topic linking inverse expansions with repeated corrections to an approximate linear-system solution. | — | `DEFERRED` | CHENEY 4.5 (pp. 171-180) | Deferred |
| `newton_method` | Newton method | Newton iteration, Newton's method | Approximation and nonlinear equations | An iterative root-finding method that replaces a nonlinear function locally by its first-order model. | — | `FUTURE_CANDIDATE` | NLA-CH14 14.5 (pp. 137-140); CHENEY 3.2 (pp. 64-74) | Future |
| `nodal_error` | nodal error | — | Numerical ODE | The signed or absolute difference between a numerical approximation and the exact solution at one grid node, with the sign convention stated. | `global_error` | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523) | Blocked by decision |
| `normal_equations` | normal equations | — | Numerical linear algebra | The linear equations obtained by setting the least-squares residual orthogonal to the matrix column space. | — | `MODULE_DRAFT` | NLA-CH14 14.2 (pp. 128-132) | Relevant module launch |
| `norms_and_the_analysis_of_errors` | norms and the analysis of errors | — | Cross-cutting numerical analysis | An umbrella source topic connecting norm-based size measures to perturbation and error bounds. | — | `DEFERRED` | CHENEY 4.4 (pp. 161-170) | Deferred |
| `null_space` | null space | kernel of a matrix | Numerical linear algebra | The set of vectors mapped to zero by a linear transformation. | — | `MODULE_DRAFT` | NLA-CH01 1.3 (pp. 3-5) | Relevant module launch |
| `numerical_approximation` | numerical approximation | numerical solution | Numerical ODE | A computed value or discrete function intended to approximate an exact mathematical quantity. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-004 (pp. 3-8) | High after review |
| `numerical_differentiation` | numerical differentiation | — | Approximation and nonlinear equations | Approximation of derivative values from sampled function data. | — | `FUTURE_CANDIDATE` | CHENEY 7.1 (pp. 430-442) | Future |
| `numerical_integration` | numerical integration | — | Approximation and nonlinear equations | Approximation of a definite integral by a finite weighted combination of function values or related data. | — | `FUTURE_CANDIDATE` | CHENEY 7.2 (pp. 443-455) | Future |
| `numerical_stability` | numerical stability | stable algorithm, stable computation, unstable algorithm, unstable computation | Cross-cutting numerical analysis | The extent to which an algorithm controls the propagation and amplification of numerical perturbations. | `conditioning`, `absolute_stability` | `CORE_PROJECT_DRAFT` | NLA-CH03 3.4 (pp. 31-33); CHENEY 2.3 (pp. 48-56) | High after review |
| `observed_order` | observed order | — | Numerical ODE | An empirical estimate of a convergence rate computed from errors on refined grids. | `convergence`, `order_of_convergence`, `asymptotic_region` | `DECISION_REQUIRED` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) | Blocked by decision |
| `ode_consistency` | ode consistency | consistency, consistent method | Numerical ODE | The property that a discrete ODE method's local defect vanishes at the required rate as the step size tends to zero. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-006 (pp. 10-14) | High after review |
| `one_step_method` | one step method | one-step method | Numerical ODE | An ODE method whose next state is determined from the current state and current-step data. | — | `MODULE_DRAFT` | NOTES-2025 outline-002 (pp. 3-3) | Relevant module launch |
| `operator_splitting` | operator splitting | — | Numerical PDE | Approximation of an evolution generated by a sum of operators through a sequence of simpler subproblems. | — | `MODULE_DRAFT` | NOTES-2025 outline-027 (pp. 54-54) | Relevant module launch |
| `order_of_convergence` | order of convergence | — | Numerical ODE | The asymptotic exponent that describes how an error decreases as a resolution parameter approaches its limit. | `convergence` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) | High after review |
| `ordinary_differential_equation` | ordinary differential equation (ODE) | ODE, ordinary differential equation | Numerical ODE | An equation relating an unknown function of one independent variable to its ordinary derivatives. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH02 2.1 (pp. 13-13); CHENEY 8.6 (pp. 524-530) | High after review |
| `orthogonal_matrix` | orthogonal matrix | — | Numerical linear algebra | A real square matrix whose transpose is its inverse. | — | `MODULE_DRAFT` | NLA-CH15 15.1 (pp. 141-143) | Relevant module launch |
| `orthogonal_projection` | orthogonal projection | — | Numerical linear algebra | The closest-point projection onto a subspace measured by an inner-product norm. | — | `MODULE_DRAFT` | NLA-CH14 14.2 (pp. 128-132) | Relevant module launch |
| `other_methods_for_hyperbolic_problems` | other methods for hyperbolic problems | — | Numerical PDE | An umbrella source section for hyperbolic-PDE discretizations not represented as one standalone term. | — | `DEFERRED` | CHENEY 9.7 (pp. 616-621) | Deferred |
| `overflow` | overflow | — | Cross-cutting numerical analysis | A floating-point event in which a magnitude exceeds the largest representable finite value. | `floating_point_number` | `CORE_PROJECT_DRAFT` | CHENEY 2.1 (pp. 28-40) | High after review |
| `p_norm` | p-norm | — | Numerical linear algebra | A vector norm formed from the pth root of the sum of pth powers of component magnitudes, with limiting cases stated separately. | — | `MODULE_DRAFT` | NLA-CH08 8.1 (pp. 71-71) | Relevant module launch |
| `parabolic_pde` | parabolic pde | parabolic equation | Numerical PDE | A PDE class with diffusion-like smoothing and an evolution direction under suitable conditions. | — | `MODULE_DRAFT` | CHENEY 9.1 (pp. 572-579) | Relevant module launch |
| `partial_differential_equation` | partial differential equation (PDE) | PDE | Numerical PDE | An equation involving partial derivatives of a function of more than one independent variable. | — | `MODULE_DRAFT` | NOTES-2025 outline-019 (pp. 43-43); NLA-CH18 18.1 (pp. 187-189); CHENEY 9.5 (pp. 598-605) | Relevant module launch |
| `partial_pivoting` | partial pivoting | — | Numerical linear algebra | Pivoting that selects a large-magnitude entry from the active column and swaps rows. | — | `MODULE_DRAFT` | NLA-CH03 3.4 (pp. 31-33) | Relevant module launch |
| `permutation_matrix` | permutation matrix | — | Numerical linear algebra | A matrix that reorders vector components or matrix rows or columns. | — | `MODULE_DRAFT` | NLA-CH04 4.4 (pp. 43-43) | Relevant module launch |
| `pivot` | pivot | pivoting | Numerical linear algebra | The entry used to eliminate or normalize other entries during a factorization or row-reduction step. | — | `MODULE_DRAFT` | NLA-CH03 3.4 (pp. 31-33); CHENEY 4.3 (pp. 139-160) | Relevant module launch |
| `plu_factorization` | PLU factorization | PLU decomposition | Numerical linear algebra | An LU-type factorization that records row permutations explicitly. | `lu_factorization`, `permutation_matrix` | `MODULE_DRAFT` | NLA-CH04 4.1 (pp. 35-38) | Relevant module launch |
| `poisson_equation` | Poisson equation | — | Numerical PDE | An elliptic partial differential equation in which a Laplacian equals a prescribed source term. | `laplace_equation`, `boundary_condition` | `MODULE_DRAFT` | NLA-CH02 2.8 (pp. 21-23); CHENEY 9.9 (pp. 631-635) | Relevant module launch |
| `polynomial_degree` | polynomial degree | — | Approximation and nonlinear equations | The highest exponent with a nonzero coefficient in a polynomial. | `polynomial_interpolation` | `FUTURE_CANDIDATE` | CHENEY 6.1 (pp. 278-295) | Future |
| `polynomial_interpolation` | polynomial interpolation | — | Approximation and nonlinear equations | Construction of a polynomial that matches prescribed data values at selected nodes. | — | `FUTURE_CANDIDATE` | CHENEY 6.1 (pp. 278-295) | Future |
| `polynomial_zero` | polynomial zero | zero of a polynomial, zeros of polynomials | Approximation and nonlinear equations | A value at which a polynomial evaluates to zero. | — | `FUTURE_CANDIDATE` | CHENEY 3.5 (pp. 88-107) | Future |
| `power_iteration` | power iteration | power method | Numerical linear algebra | An eigenvector iteration that repeatedly applies a matrix and normalizes, typically targeting a dominant eigenvalue. | — | `MODULE_DRAFT` | NLA-CH20 20.1 (pp. 203-207); CHENEY 5.1 (pp. 226-236) | Relevant module launch |
| `problems_without_time_dependence_galerkin_and_ritz_methods` | problems without time dependence galerkin and ritz methods | — | Numerical PDE | An umbrella source section for steady PDE approximation by weighted-residual and variational methods. | — | `DEFERRED` | CHENEY 9.4 (pp. 591-597) | Deferred |
| `pseudoinverse` | pseudoinverse | Moore-Penrose, pseudo-inverse | Numerical linear algebra | A generalized inverse satisfying the Moore-Penrose conditions and supporting least-squares and minimum-norm solutions. | — | `MODULE_DRAFT` | NLA-CH24 24.3 (pp. 253-254); CHENEY 5.4 (pp. 258-268) | Relevant module launch |
| `qr_factorization` | QR factorization | QR decomposition | Numerical linear algebra | A factorization of a matrix into an orthogonal or unitary factor and an upper-triangular factor. | `orthogonal_matrix` | `MODULE_DRAFT` | NLA-CH16 16.1 (pp. 151-151) | Relevant module launch |
| `qr_iteration` | QR iteration | QR algorithm | Numerical linear algebra | An eigenvalue iteration that repeatedly factors a matrix as QR and reverses the factors, usually with shifts and preliminary reduction. | — | `MODULE_DRAFT` | NLA-CH22 22.1 (pp. 229-231); CHENEY 5.5 (pp. 269-277) | Relevant module launch |
| `quadrature` | quadrature | — | Approximation and nonlinear equations | Approximation of a definite integral by a weighted sum of function values. | — | `FUTURE_CANDIDATE` | CHENEY 7.3 (pp. 456-464) | Future |
| `rank` | rank | full rank, matrix rank, rank deficient, rank-deficient | Numerical linear algebra | The dimension of a linear transformation's range, equivalently the number of independent rows or columns. | — | `MODULE_DRAFT` | NLA-CH14 14.3 (pp. 133-135) | Relevant module launch |
| `rayleigh_quotient` | rayleigh quotient | — | Numerical linear algebra | The scalar ratio formed from a vector and a matrix that estimates an eigenvalue. | — | `MODULE_DRAFT` | NLA-CH15 15.4 (pp. 148-149) | Relevant module launch |
| `relative_error` | relative error | — | Cross-cutting numerical analysis | Absolute error scaled by a stated reference magnitude, with zero-reference behavior defined separately. | `absolute_error` | `DECISION_REQUIRED` | NLA-CH03 3.3 (pp. 28-30); CHENEY 2.2 (pp. 41-47) | Blocked by decision |
| `residual` | residual | — | Cross-cutting numerical analysis | The amount by which an approximate result fails to satisfy the original equation or algebraic condition. | `forward_error`, `conditioning` | `DECISION_REQUIRED` | NLA-CH10 10.2 (pp. 96-99) | Blocked by decision |
| `richardson_extrapolation` | Richardson extrapolation | — | Approximation and nonlinear equations | Combination of approximations at related resolutions to cancel a leading error term. | — | `FUTURE_CANDIDATE` | NOTES-2025 outline-004 (pp. 3-8); CHENEY 7.1 (pp. 430-442) | Future |
| `romberg_integration` | Romberg integration | — | Approximation and nonlinear equations | A tableau method that applies Richardson extrapolation to composite trapezoidal approximations. | — | `FUTURE_CANDIDATE` | CHENEY 7.4 (pp. 465-470) | Future |
| `roundoff_error` | roundoff error | round-off error | Cross-cutting numerical analysis | The discrepancy introduced when exact arithmetic operations are represented in finite precision. | — | `CORE_PROJECT_DRAFT` | CHENEY 2.1 (pp. 28-40) | High after review |
| `row_operation` | row operation | row swapping | Numerical linear algebra | A permitted transformation of matrix rows used to produce an equivalent linear system. | — | `MODULE_DRAFT` | NLA-CH03 3.1 (pp. 25-26) | Relevant module launch |
| `runge_kutta_method` | Runge-Kutta method | Runge-Kutta | Numerical ODE | A one-step ODE method that combines several within-step derivative evaluations. | — | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.3 (pp. 499-507) | High after review |
| `sard_theory_of_approximating_functionals` | sard theory of approximating functionals | — | Approximation and nonlinear equations | A source topic concerning optimal approximation of linear functionals; it is deferred as a standalone project term. | — | `DEFERRED` | CHENEY 7.6 (pp. 477-480) | Deferred |
| `scalar` | scalar | — | Cross-cutting numerical analysis | A single quantity from the underlying number system rather than a vector or matrix. | — | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH09 9.2 (pp. 81-86) | Blocked by decision |
| `schur_and_gershgorin_theorems` | schur and gershgorin theorems | — | Numerical linear algebra | An umbrella source topic for spectral localization and triangularization results; individual theorem terms are deferred. | — | `DEFERRED` | CHENEY 5.2 (pp. 237-244) | Deferred |
| `secant_method` | secant method | — | Approximation and nonlinear equations | A root-finding iteration that replaces the derivative in Newton's method by a slope through two recent points. | — | `FUTURE_CANDIDATE` | CHENEY 3.3 (pp. 75-79) | Future |
| `shifted_iteration` | shifted iteration | shifts | Numerical linear algebra | An eigenvalue iteration applied to a matrix offset by a chosen scalar to change spectral targeting or convergence. | — | `MODULE_DRAFT` | NLA-CH22 22.2 (pp. 232-232) | Relevant module launch |
| `shooting_method` | shooting method | — | Numerical ODE | A boundary-value method that adjusts missing initial data until an integrated solution satisfies the terminal boundary condition. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.8 (pp. 540-546) | High after review |
| `simplex_algorithm` | simplex algorithm | — | Optimization | A linear-programming algorithm that moves among feasible vertices while improving the objective. | — | `OUT_OF_SCOPE` | CHENEY 10.4 (pp. 652-661) | Out of current product scope |
| `singular_matrix` | singular matrix | singular | Numerical linear algebra | A square matrix that is not invertible. | — | `MODULE_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH01 1.4 (pp. 6-6); CHENEY 5.4 (pp. 258-268) | Relevant module launch |
| `singular_value` | singular value | — | Numerical linear algebra | A nonnegative scale factor in the singular value decomposition, equal to the square root of an eigenvalue of the associated Gram matrix. | — | `MODULE_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH09 9.3 (pp. 87-87) | Relevant module launch |
| `singular_value_decomposition` | singular value decomposition (SVD) | SVD, singular value decomposition | Numerical linear algebra | A factorization expressing a matrix through orthogonal or unitary singular-vector bases and nonnegative singular values. | `singular_value`, `pseudoinverse`, `low_rank_approximation` | `MODULE_DRAFT` | NLA-CH09 9.3 (pp. 87-87) | Relevant module launch |
| `smoothing` | smoothing | error smoothing, smoother | Numerical PDE | Reduction of high-frequency error components by a relaxation method, especially within multigrid. | — | `MODULE_DRAFT` | NLA-CH27 27.2 (pp. 294-295) | Relevant module launch |
| `solution_of_equations_by_iterative_methods` | solution of equations by iterative methods | — | Numerical linear algebra | An umbrella source topic for repeated-update linear solvers; specific methods receive separate terms. | — | `DEFERRED` | CHENEY 4.6 (pp. 181-201) | Deferred |
| `sparse_matrix` | sparse matrix | sparseness | Numerical linear algebra | A matrix with enough zero entries that specialized storage and algorithms are advantageous. | — | `MODULE_DRAFT` | NLA-CH05 5.4 (pp. 51-52) | Relevant module launch |
| `spatial_grid` | spatial grid | grid-based model | Numerical PDE | A discrete set of locations used to represent a spatial domain. | — | `MODULE_DRAFT` | NLA-CH02 2.3 (pp. 15-15) | Relevant module launch |
| `spectral_radius` | spectral radius | — | Numerical linear algebra | The largest magnitude among a matrix's eigenvalues. | — | `MODULE_DRAFT` | NOTES-2025 outline-046 (pp. 78-78); NLA-CH26 26.2 (pp. 285-292) | Relevant module launch |
| `spline_interpolation` | spline interpolation | — | Approximation and nonlinear equations | Interpolation by piecewise polynomials joined with stated smoothness conditions. | — | `FUTURE_CANDIDATE` | CHENEY 6.4 (pp. 315-332) | Future |
| `stability_function` | stability function | — | Numerical ODE | A function of the scaled test-equation parameter that describes one numerical method's amplification of a step. | `absolute_stability` | `DECISION_REQUIRED` | NOTES-2025 outline-007 (pp. 15-15) | Blocked by decision |
| `stability_region` | stability region | region of absolute stability | Numerical ODE | The set of scaled test-equation parameters for which the method satisfies its stated absolute-stability condition. | `absolute_stability` | `DECISION_REQUIRED` | NOTES-2025 outline-007 (pp. 15-15) | Blocked by decision |
| `stable_equilibrium` | stable equilibrium | stability of equilibria | Numerical ODE | An equilibrium for which sufficiently small perturbations remain small under the evolution. | — | `CORE_PROJECT_DRAFT` | NLA-CH18 18.1 (pp. 187-189) | High after review |
| `stationary_iteration` | stationary iteration | linear iterative method | Numerical linear algebra | A linear-system iteration with a fixed update matrix and repeated affine update. | — | `MODULE_DRAFT` | NLA-CH25 25.1 (pp. 271-276) | Relevant module launch |
| `step_size` | step size | time step | Numerical ODE | The spacing between consecutive points in a numerical time grid. | `time_grid`, `grid_spacing` | `DECISION_REQUIRED` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH02 2.5 (pp. 16-17) | Blocked by decision |
| `stiffness` | stiffness | stiff equation, stiff system | Numerical ODE | A property of a differential problem for which stability requirements can force some otherwise suitable methods to take steps much smaller than accuracy alone would require. | `absolute_stability`, `step_size` | `DECISION_REQUIRED` | CHENEY 8.12 (pp. 566-571) | Blocked by decision |
| `stopping_criterion` | stopping criterion | when to stop | Cross-cutting numerical analysis | A rule that decides when an iterative computation has met its stated termination condition. | — | `CORE_PROJECT_DRAFT` | NLA-CH20 20.4 (pp. 213-214) | High after review |
| `subspace_iteration` | subspace iteration | block power iteration | Numerical linear algebra | A block eigenvalue iteration that repeatedly applies a matrix to a subspace and reorthogonalizes a basis. | — | `MODULE_DRAFT` | NLA-CH21 21.1 (pp. 221-221) | Relevant module launch |
| `symmetric_matrix` | symmetric matrix | — | Numerical linear algebra | A real square matrix equal to its transpose. | — | `MODULE_DRAFT` | NLA-CH09 9.2 (pp. 81-86) | Relevant module launch |
| `taylor_method` | taylor method | Taylor-series method | Numerical ODE | An ODE method that advances by truncating a Taylor expansion whose derivatives are obtained from the differential equation. | — | `CORE_PROJECT_DRAFT` | CHENEY 8.2 (pp. 491-498) | High after review |
| `taylor_series` | Taylor series | — | Approximation and nonlinear equations | A local power-series representation built from derivatives at an expansion point. | — | `FUTURE_CANDIDATE` | NOTES-2025 outline-005 (pp. 9-9); CHENEY 6.7 (pp. 354-358) | Future |
| `time_grid` | time grid | — | Numerical ODE | The ordered set of time points at which a numerical ODE method stores or advances approximations. | `step_size` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-002 (pp. 3-3); NLA-CH02 2.5 (pp. 16-17) | High after review |
| `tolerance` | tolerance | — | Cross-cutting numerical analysis | A stated numerical threshold used by a particular stopping, acceptance, or error-control rule. | `residual` | `DECISION_REQUIRED` | NLA-CH10 10.2 (pp. 96-99) | Blocked by decision |
| `trigonometric_interpolation` | trigonometric interpolation | — | Approximation and nonlinear equations | Interpolation by a finite trigonometric polynomial, often evaluated through Fourier-transform algorithms. | — | `FUTURE_CANDIDATE` | CHENEY 6.12 (pp. 409-423) | Future |
| `truncation_error` | truncation error | — | Cross-cutting numerical analysis | The defect introduced by replacing an exact infinite or continuous operation with a finite discrete approximation. | — | `DECISION_REQUIRED` | NOTES-2025 outline-001 (pp. 1-2) | Blocked by decision |
| `underflow` | underflow | — | Cross-cutting numerical analysis | A floating-point event in which a nonzero magnitude is too small for normal representation and may become subnormal or zero. | `floating_point_number` | `CORE_PROJECT_DRAFT` | CHENEY 2.1 (pp. 28-40) | High after review |
| `upwind_scheme` | upwind scheme | — | Numerical PDE | A transport discretization that selects data from the direction from which information travels. | — | `MODULE_DRAFT` | NOTES-2025 outline-036 (pp. 61-62) | Relevant module launch |
| `vector` | vector | — | Numerical linear algebra | An ordered collection of scalars representing a point, direction, state, or set of components. | — | `DECISION_REQUIRED` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH01 1.1 (pp. 1-1) | Blocked by decision |
| `vector_norm` | vector norm | norm on | Numerical linear algebra | A function that measures vector magnitude while satisfying positivity, homogeneity, and the triangle inequality. | — | `MODULE_DRAFT` | NOTES-2025 outline-006 (pp. 10-14); NLA-CH07 7.1 (pp. 63-65) | Relevant module launch |
| `von_neumann_analysis` | von Neumann analysis | von Neumann | Numerical PDE | A Fourier-mode analysis used to assess linear finite-difference stability on suitable grids. | — | `MODULE_DRAFT` | NOTES-2025 outline-046 (pp. 78-78) | Relevant module launch |
| `wave_equation` | wave equation | — | Numerical PDE | A hyperbolic PDE describing propagation with finite characteristic speed. | — | `MODULE_DRAFT` | NOTES-2025 outline-030 (pp. 57-57) | Relevant module launch |
| `zero_stability` | zero-stability | — | Numerical ODE | A root-condition property that controls the growth of perturbations in a linear multistep recurrence. | `convergence` | `CORE_PROJECT_DRAFT` | NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19) | High after review |

## Focused richer drafts

These candidates are already visible in current product teaching or are high-priority prerequisites for later reviewed content. They remain draft-only.

### `step_size` — step size

The spacing between consecutive points in a numerical time grid.

- **Scope:** Numerical ODE
- **Teaching note:** An ODE time step is not the same object as a PDE spatial grid spacing.
- **Related terms:** `time_grid`, `grid_spacing`
- **Formula candidate:** t_n = t_0 + n h
- **Evidence:** NOTES-2025 outline-002 (pp. 3-3); NLA-CH02 2.5 (pp. 16-17)
- **Readiness:** `DECISION_REQUIRED`

### `exact_solution` — exact solution

A function that satisfies the stated mathematical problem exactly within the adopted model.

- **Scope:** Numerical ODE
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** `numerical_approximation`, `global_error`
- **Formula candidate:** No single formula proposed.
- **Evidence:** NOTES-2025 outline-002 (pp. 3-3); NLA-CH07 7.1 (pp. 63-65)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `numerical_approximation` — numerical approximation

A computed value or discrete function intended to approximate an exact mathematical quantity.

- **Scope:** Numerical ODE
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** —
- **Formula candidate:** No single formula proposed.
- **Evidence:** NOTES-2025 outline-004 (pp. 3-8)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `absolute_error` — absolute error

The magnitude of the difference between an approximate value and its reference value.

- **Scope:** Cross-cutting numerical analysis
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** `relative_error`, `model_error`, `discretization_error`, `roundoff_error`
- **Formula candidate:** |x_approx - x_ref|
- **Evidence:** NLA-CH03 3.3 (pp. 28-30)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `relative_error` — relative error

Absolute error scaled by a stated reference magnitude, with zero-reference behavior defined separately.

- **Scope:** Cross-cutting numerical analysis
- **Teaching note:** A relative error needs a declared reference scale and a zero-reference rule.
- **Related terms:** `absolute_error`
- **Formula candidate:** |x_approx - x_ref| / |x_ref| when the denominator is nonzero
- **Evidence:** NLA-CH03 3.3 (pp. 28-30); CHENEY 2.2 (pp. 41-47)
- **Readiness:** `DECISION_REQUIRED`

### `local_truncation_error` — local truncation error

The one-step defect obtained by inserting exact data into a discrete method, with any step normalization stated explicitly.

- **Scope:** Numerical ODE
- **Teaching note:** Unscaled and step-normalized definitions differ by a factor of the step size.
- **Related terms:** —
- **Formula candidate:** No single formula proposed.
- **Evidence:** NOTES-2025 outline-004 (pp. 3-8)
- **Readiness:** `DECISION_REQUIRED`

### `global_error` — global error

The difference between the numerical approximation and exact solution after accumulated numerical steps, with the aggregation and sign stated.

- **Scope:** Numerical ODE
- **Teaching note:** Endpoint error and maximum-over-grid error are different aggregate views of global error.
- **Related terms:** `exact_solution`, `numerical_approximation`, `step_size`, `nodal_error`, `final_time_error`, `maximum_global_error`
- **Formula candidate:** e_n = u_n - y(t_n), with sign convention declared
- **Evidence:** NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523)
- **Readiness:** `DECISION_REQUIRED`

### `final_time_error` — final-time error

The absolute difference between the numerical and exact values at the final grid point.

- **Scope:** Numerical ODE
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** `global_error`
- **Formula candidate:** |u_N - y(t_end)|
- **Evidence:** NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `maximum_global_error` — maximum global error

The largest absolute nodal error over all returned grid points.

- **Scope:** Numerical ODE
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** `global_error`
- **Formula candidate:** max_n |u_n - y(t_n)|
- **Evidence:** NOTES-2025 outline-006 (pp. 10-14); CHENEY 8.5 (pp. 516-523)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `observed_order` — observed order

An empirical estimate of a convergence rate computed from errors on refined grids.

- **Scope:** Numerical ODE
- **Teaching note:** A finite error ratio is not automatically in the asymptotic region.
- **Related terms:** `convergence`, `order_of_convergence`, `asymptotic_region`
- **Formula candidate:** log(E(h)/E(h/r)) / log(r)
- **Evidence:** NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19)
- **Readiness:** `DECISION_REQUIRED`

### `asymptotic_region` — asymptotic region

A refinement range in which the leading error term dominates and observed rates can meaningfully approximate theoretical order.

- **Scope:** Cross-cutting numerical analysis
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** `convergence`
- **Formula candidate:** No single formula proposed.
- **Evidence:** NOTES-2025 outline-004 (pp. 3-8); NLA-CH08 8.4 (pp. 78-78); CHENEY 1.2 (pp. 9-19)
- **Readiness:** `DECISION_REQUIRED`

### `residual` — residual

The amount by which an approximate result fails to satisfy the original equation or algebraic condition.

- **Scope:** Cross-cutting numerical analysis
- **Teaching note:** A small residual need not imply a small solution error for an ill-conditioned problem.
- **Related terms:** `forward_error`, `conditioning`
- **Formula candidate:** r = b - A x_hat for a linear system
- **Evidence:** NLA-CH10 10.2 (pp. 96-99)
- **Readiness:** `DECISION_REQUIRED`

### `conditioning` — conditioning

The sensitivity of a problem output to small changes in its input data.

- **Scope:** Cross-cutting numerical analysis
- **Teaching note:** Conditioning is a property of the problem, not the implementation alone.
- **Related terms:** `condition_number`, `numerical_stability`
- **Formula candidate:** No single formula proposed.
- **Evidence:** NLA-CH07 7.1 (pp. 63-65); CHENEY 2.3 (pp. 48-56)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `numerical_stability` — numerical stability

The extent to which an algorithm controls the propagation and amplification of numerical perturbations.

- **Scope:** Cross-cutting numerical analysis
- **Teaching note:** Algorithmic stability is distinct from problem conditioning and from ODE absolute stability.
- **Related terms:** `conditioning`, `absolute_stability`
- **Formula candidate:** No single formula proposed.
- **Evidence:** NLA-CH03 3.4 (pp. 31-33); CHENEY 2.3 (pp. 48-56)
- **Readiness:** `CORE_PROJECT_DRAFT`

### `absolute_stability` — absolute stability

Behavior of a time-stepping method on a specified test equation as a function of the scaled step parameter.

- **Scope:** Numerical ODE
- **Teaching note:** Absolute stability does not guarantee accuracy.
- **Related terms:** `ordinary_differential_equation`, `step_size`
- **Formula candidate:** apply the method to y' = lambda y and inspect z = h lambda
- **Evidence:** NOTES-2025 outline-007 (pp. 15-15)
- **Readiness:** `DECISION_REQUIRED`

### `stiffness` — stiffness

A property of a differential problem for which stability requirements can force some otherwise suitable methods to take steps much smaller than accuracy alone would require.

- **Scope:** Numerical ODE
- **Teaching note:** Stiffness is a problem property, not a synonym for using an implicit method.
- **Related terms:** `absolute_stability`, `step_size`
- **Formula candidate:** No single formula proposed.
- **Evidence:** CHENEY 8.12 (pp. 566-571)
- **Readiness:** `DECISION_REQUIRED`

### `linear_system` — linear system

A collection of linear equations represented compactly as a matrix equation.

- **Scope:** Numerical linear algebra
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** —
- **Formula candidate:** A x = b
- **Evidence:** NOTES-2025 outline-007 (pp. 15-15); NLA-CH01 1.3 (pp. 3-5)
- **Readiness:** `MODULE_DRAFT`

### `condition_number` — condition number

A measure of how strongly relative input perturbations may affect the corresponding output.

- **Scope:** Numerical linear algebra
- **Teaching note:** Use only in the stated scope; do not substitute a nearby term without checking the mathematical object.
- **Related terms:** `matrix_norm`, `vector_norm`
- **Formula candidate:** kappa(A) = ||A|| ||A^{-1}|| for an invertible matrix and a chosen induced norm
- **Evidence:** NLA-CH10 10.1 (pp. 91-95)
- **Readiness:** `MODULE_DRAFT`

## Production boundary

The next step is maintainer review, not code generation. Runtime registries, ODE annotations, Tutor cards, queue behavior, and production definitions remain outside this goal.
